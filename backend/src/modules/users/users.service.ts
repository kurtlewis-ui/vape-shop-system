import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto, createdBy: string) {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Verify role exists
    const role = await this.prisma.role.findUnique({
      where: { id: createUserDto.roleId },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Hash password
    const bcryptRounds = parseInt(this.config.get<string>('BCRYPT_ROUNDS') ?? '12', 10) || 12;
    const passwordHash = await bcrypt.hash(createUserDto.password, bcryptRounds);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        passwordHash,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        roleId: createUserDto.roleId,
        phone: createUserDto.phone,
        mustChangePassword: true, // Force password change on first login
      },
      include: {
        role: true,
      },
    });

    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        userId: createdBy,
        action: 'USER_CREATED',
        entityType: 'User',
        entityId: user.id,
        newValues: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: role.name,
        },
      },
    });

    // Remove password hash from response
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findAll(query: QueryUserDto) {
    const {
      page = 1,
      limit = 20,
      search,
      roleId,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (roleId) {
      where.roleId = roleId;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    // Get total count
    const total = await this.prisma.user.count({ where });

    // Get users
    const users = await this.prisma.user.findMany({
      where,
      include: {
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    });

    // Remove password hashes
    const usersWithoutPasswords = users.map(({ passwordHash, ...user }) => user);

    return {
      data: usersWithoutPasswords,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Remove password hash
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(id: string, updateUserDto: UpdateUserDto, updatedBy: string) {
    // Get current user
    const currentUser = await this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        role: true,
      },
    });

    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    // Prevent modifying Owner role users (unless you are owner)
    const updaterRole = await this.prisma.user.findUnique({
      where: { id: updatedBy },
      include: { role: true },
    });

    if (currentUser.role.name === 'Owner' && updaterRole?.role.name !== 'Owner') {
      throw new ForbiddenException('Cannot modify Owner accounts');
    }

    // If changing role, verify new role exists
    if (updateUserDto.roleId) {
      const newRole = await this.prisma.role.findUnique({
        where: { id: updateUserDto.roleId },
      });

      if (!newRole) {
        throw new NotFoundException('Role not found');
      }

      // Prevent changing Owner to another role
      if (currentUser.role.name === 'Owner') {
        throw new ForbiddenException('Cannot change Owner role');
      }
    }

    // Check email uniqueness if being changed
    if (updateUserDto.email && updateUserDto.email !== currentUser.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    // Update user
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      include: {
        role: true,
      },
    });

    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        userId: updatedBy,
        action: 'USER_UPDATED',
        entityType: 'User',
        entityId: id,
        oldValues: {
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          email: currentUser.email,
          roleId: currentUser.roleId,
          isActive: currentUser.isActive,
        },
        newValues: updateUserDto as unknown as Prisma.InputJsonValue,
      },
    });

    // Remove password hash
    const { passwordHash, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async resetPassword(
    id: string,
    newPassword: string,
    confirmPassword: string,
    resetBy: string,
  ) {
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('New passwords do not match');
    }

    // Get the target user
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Only an Owner can change an Owner account's password
    const resetter = await this.prisma.user.findUnique({
      where: { id: resetBy },
      include: { role: true },
    });

    if (user.role.name === 'Owner' && resetter?.role.name !== 'Owner') {
      throw new ForbiddenException('Cannot change an Owner account password');
    }

    // Hash and store the new password
    const bcryptRounds = parseInt(this.config.get<string>('BCRYPT_ROUNDS') ?? '12', 10) || 12;
    const passwordHash = await bcrypt.hash(newPassword, bcryptRounds);

    await this.prisma.user.update({
      where: { id },
      data: {
        passwordHash,
        passwordChangedAt: new Date(),
        mustChangePassword: false,
        failedLoginAttempts: 0,
        isLocked: false,
      },
    });

    // Force the user to log in again with the new password
    await this.prisma.session.deleteMany({
      where: { userId: id },
    });

    // Audit log (never store the password value)
    await this.prisma.auditLog.create({
      data: {
        userId: resetBy,
        action: 'USER_PASSWORD_RESET',
        entityType: 'User',
        entityId: id,
      },
    });

    return { message: 'Password updated successfully' };
  }

  async remove(id: string, deletedBy: string) {
    // Get user
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Prevent deleting Owner role users
    if (user.role.name === 'Owner') {
      throw new ForbiddenException('Cannot delete Owner accounts');
    }

    // Prevent self-deletion
    if (id === deletedBy) {
      throw new BadRequestException('Cannot delete your own account');
    }

    // Soft delete
    await this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });

    // Delete all user sessions
    await this.prisma.session.deleteMany({
      where: { userId: id },
    });

    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        userId: deletedBy,
        action: 'USER_DELETED',
        entityType: 'User',
        entityId: id,
        oldValues: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      },
    });

    return { message: 'User deleted successfully' };
  }

  async getRoles() {
    return this.prisma.role.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
  }
}
