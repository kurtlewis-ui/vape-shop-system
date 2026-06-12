import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtPayload, JwtRefreshPayload } from '../../common/interfaces/request-user.interface';

@Injectable()
export class AuthService {
  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION_MINUTES = 15;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async login(loginDto: LoginDto, ipAddress: string, userAgent: string) {
    const { email, password } = loginDto;

    // Find user with role
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if account is locked
    if (user.isLocked) {
      throw new ForbiddenException(
        `Account locked due to multiple failed login attempts. Try again after ${this.LOCKOUT_DURATION_MINUTES} minutes.`,
      );
    }

    // Check if account is active
    if (!user.isActive) {
      throw new ForbiddenException('Account is disabled');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      // Increment failed attempts
      await this.handleFailedLogin(user.id);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset failed attempts on successful login
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        isLocked: false,
        lastLoginAt: new Date(),
        lastLoginIp: ipAddress,
      },
    });

    // Create session
    const session = await this.createSession(user.id, ipAddress, userAgent);

    // Generate tokens
    const accessToken = this.generateAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role.name,
      sessionId: session.id,
    });

    const refreshToken = this.generateRefreshToken({
      sub: user.id,
      sessionId: session.id,
      tokenVersion: session.tokenVersion,
    });

    // Hash and store refresh token
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.prisma.session.update({
      where: { id: session.id },
      data: { refreshTokenHash },
    });

    // Create audit log
    await this.createAuditLog(user.id, 'LOGIN', ipAddress, userAgent);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: {
          id: user.role.id,
          name: user.role.name,
        },
        mustChangePassword: user.mustChangePassword,
      },
    };
  }

  async logout(userId: string, sessionId: string) {
    // Delete session
    await this.prisma.session.delete({
      where: { id: sessionId },
    });

    // Create audit log
    await this.createAuditLog(userId, 'LOGOUT', null, null);

    return { message: 'Logged out successfully' };
  }

  async refreshToken(userId: string, sessionId: string, ipAddress: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    if (!user || !user.isActive || user.isLocked) {
      throw new UnauthorizedException('Invalid user');
    }

    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    // Update session last activity
    await this.prisma.session.update({
      where: { id: sessionId },
      data: {
        lastActivityAt: new Date(),
        ipAddress,
      },
    });

    // Generate new access token
    const accessToken = this.generateAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role.name,
      sessionId: session.id,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: {
          id: user.role.id,
          name: user.role.name,
        },
      },
    };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword, confirmPassword } = changePasswordDto;

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('New passwords do not match');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Check if new password is same as old
    const isSamePassword = await bcrypt.compare(newPassword, user.passwordHash);
    if (isSamePassword) {
      throw new BadRequestException('New password must be different from current password');
    }

    // Hash new password
    const bcryptRounds = parseInt(this.config.get('BCRYPT_ROUNDS')) || 12;
    const newPasswordHash = await bcrypt.hash(newPassword, bcryptRounds);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: newPasswordHash,
        passwordChangedAt: new Date(),
        mustChangePassword: false,
      },
    });

    // Invalidate all sessions except current (force re-login)
    await this.prisma.session.deleteMany({
      where: {
        userId,
      },
    });

    // Create audit log
    await this.createAuditLog(userId, 'PASSWORD_CHANGED', null, null);

    return { message: 'Password changed successfully. Please login again.' };
  }

  private async handleFailedLogin(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const newFailedAttempts = user.failedLoginAttempts + 1;
    const isLocked = newFailedAttempts >= this.MAX_FAILED_ATTEMPTS;

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: newFailedAttempts,
        isLocked,
      },
    });

    // Create audit log for failed login
    await this.createAuditLog(userId, 'LOGIN_FAILED', null, null);

    if (isLocked) {
      // Schedule unlock after lockout duration
      setTimeout(async () => {
        await this.prisma.user.update({
          where: { id: userId },
          data: {
            isLocked: false,
            failedLoginAttempts: 0,
          },
        });
      }, this.LOCKOUT_DURATION_MINUTES * 60 * 1000);
    }
  }

  private async createSession(userId: string, ipAddress: string, userAgent: string) {
    const sessionTimeout = parseInt(this.config.get('SESSION_TIMEOUT')) || 900; // 15 minutes
    const expiresAt = new Date(Date.now() + sessionTimeout * 1000);

    return this.prisma.session.create({
      data: {
        userId,
        refreshTokenHash: '', // Will be updated after token generation
        ipAddress,
        userAgent,
        expiresAt,
      },
    });
  }

  private generateAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_EXPIRATION') || '15m',
    });
  }

  private generateRefreshToken(payload: JwtRefreshPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_EXPIRATION') || '7d',
    });
  }

  private async createAuditLog(
    userId: string,
    action: string,
    ipAddress: string | null,
    userAgent: string | null,
  ) {
    await this.prisma.auditLog.create({
      data: {
        userId,
        action,
        entityType: 'User',
        entityId: userId,
        ipAddress,
        userAgent,
      },
    });
  }
}
