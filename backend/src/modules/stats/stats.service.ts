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
        where: { deletedAt: null, role: { name: 'Admin' } },
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

  /**
   * Approved-sales totals bucketed over time for the Sales Overview chart.
   */
  async salesOverview(period: string, branchId?: string) {
    const unit = period === 'monthly' ? 'month' : period === 'weekly' ? 'week' : 'day';
    const sinceDays = period === 'monthly' ? 365 : period === 'weekly' ? 84 : 14;

    const params: any[] = [];
    let branchClause = '';
    if (branchId) {
      params.push(branchId);
      branchClause = ` AND branch_id = $${params.length}::uuid`;
    }

    const sql =
      `SELECT date_trunc('${unit}', created_at) AS bucket, ` +
      `COALESCE(SUM(total), 0) AS total, COUNT(*) AS count ` +
      `FROM sales WHERE status = 'APPROVED' ` +
      `AND created_at >= now() - interval '${sinceDays} days'${branchClause} ` +
      `GROUP BY bucket ORDER BY bucket ASC`;

    const rows = await this.prisma.$queryRawUnsafe<
      { bucket: Date; total: any; count: any }[]
    >(sql, ...params);

    return rows.map((r) => ({
      date: r.bucket,
      total: Number(r.total),
      count: Number(r.count),
    }));
  }

  /**
   * Top selling products (by units) from approved sales.
   */
  async topProducts(branchId?: string) {
    const items = await this.prisma.saleItem.groupBy({
      by: ['name', 'brandName'],
      where: {
        sale: { status: SaleStatus.APPROVED, ...(branchId ? { branchId } : {}) },
      },
      _sum: { quantity: true, subTotal: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 10,
    });

    return items.map((i) => ({
      name: i.name,
      brand: i.brandName,
      quantity: i._sum.quantity ?? 0,
      revenue: Number(i._sum.subTotal ?? 0),
    }));
  }
}
