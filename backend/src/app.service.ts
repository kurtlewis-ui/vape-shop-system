import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getHealth() {
    try {
      // Check database connection
      await this.prisma.$queryRaw`SELECT 1`;
      
      return {
        status: 'healthy',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        services: {
          database: 'healthy',
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        services: {
          database: 'unhealthy',
        },
      };
    }
  }

  getVersion() {
    return {
      version: '1.0.0',
      apiVersion: 'v1',
      buildDate: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
