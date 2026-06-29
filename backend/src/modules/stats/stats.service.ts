import { Injectable } from '@nestjs/common';
import { SaleStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async dashboard() {
    const [
      shops,
      products,
      brands,
      pendingSales,
      approvedSales,
      staff,
      admins,
      approvedTotal,
    ] = await Promise.all([
      this.prisma.branch.count({ where: { deletedAt: null } }),
      this.prisma.product.count({ where: { deletedAt: null } }),
      this.prisma.brand.count({ where: { deletedAt: null } }),
      this.prisma.sale.count({ where: { status: SaleStatus.PENDING } }),
      this.prisma.sale.count({ where: { status: SaleStatus.APPROVED } }),
      this.prisma.user.count({
        where: { deletedAt: null, role: { name: 'Staff' } },
      }),
      this.prisma.user.count({
        where: { deletedAt: null, role: { name: { in: ['Admin', 'Owner'] } } },
      }),
      this.prisma.sale.aggregate({
        where: { status: SaleStatus.APPROVED },
        _sum: { total: true },
      }),
    ]);

    return {
      shops,
      products,
      brands,
      pendingSales,
      approvedSales,
      staff,
      admins,
      approvedSalesTotal: Number(approvedTotal._sum.total ?? 0),
    };
  }
}
