import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDisposalDto } from './dto/create-disposal.dto';
import { QueryDisposalDto } from './dto/query-disposal.dto';
import { RequestUser } from '../../common/interfaces/request-user.interface';

@Injectable()
export class DisposalsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Write off stock: validates availability at the branch, decrements
   * inventory, and records a disposal with price/value snapshots.
   */
  async create(dto: CreateDisposalDto, actor: RequestUser) {
    const branchId = await this.resolveBranchForActor(actor, dto.branchId);

    const product = await this.prisma.product.findFirst({
      where: { id: dto.productId, deletedAt: null },
      include: { brand: { select: { name: true } } },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.$transaction(async (tx) => {
      const inv = await tx.inventory.findUnique({
        where: { productId_branchId: { productId: product.id, branchId } },
      });
      const available = inv?.quantity ?? 0;
      if (available < dto.quantity) {
        throw new BadRequestException(
          `Insufficient stock to dispose (need ${dto.quantity}, have ${available})`,
        );
      }

      await tx.inventory.update({
        where: { productId_branchId: { productId: product.id, branchId } },
        data: { quantity: { decrement: dto.quantity } },
      });

      const unitPrice = new Prisma.Decimal(product.sellingPrice);
      const value = unitPrice.mul(dto.quantity);

      const disposal = await tx.disposal.create({
        data: {
          branchId,
          productId: product.id,
          productName: product.name,
          brandName: product.brand.name,
          quantity: dto.quantity,
          unitPrice,
          value,
          reason: dto.reason?.trim() || null,
          createdById: actor.userId,
        },
        include: this.includeFull(),
      });

      await tx.auditLog.create({
        data: {
          userId: actor.userId,
          action: 'DISPOSAL_RECORDED',
          entityType: 'Disposal',
          entityId: disposal.id,
          newValues: { product: product.name, quantity: dto.quantity },
        },
      });

      return this.serialize(disposal);
    });
  }

  async findAll(query: QueryDisposalDto, actor: RequestUser) {
    const { page = 1, limit = 50, search, branchId, startDate, endDate } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.DisposalWhereInput = {};

    if (actor.role === 'Staff') {
      const me = await this.prisma.user.findUnique({
        where: { id: actor.userId },
        select: { branchId: true },
      });
      where.branchId = me?.branchId ?? '00000000-0000-0000-0000-000000000000';
    } else if (branchId) {
      where.branchId = branchId;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    if (search) {
      where.OR = [
        { productName: { contains: search, mode: 'insensitive' } },
        { brandName: { contains: search, mode: 'insensitive' } },
        { reason: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, disposals, agg] = await Promise.all([
      this.prisma.disposal.count({ where }),
      this.prisma.disposal.findMany({
        where,
        include: this.includeFull(),
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.disposal.aggregate({ where, _sum: { value: true, quantity: true } }),
    ]);

    return {
      data: disposals.map((d) => this.serialize(d)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
      summary: {
        totalValue: Number(agg._sum.value ?? 0),
        totalQuantity: agg._sum.quantity ?? 0,
        count: total,
      },
    };
  }

  private async resolveBranchForActor(actor: RequestUser, branchId?: string) {
    if (actor.role === 'Staff') {
      const me = await this.prisma.user.findUnique({
        where: { id: actor.userId },
        select: { branchId: true },
      });
      if (!me?.branchId) {
        throw new BadRequestException('Your account is not assigned to a branch.');
      }
      return me.branchId;
    }
    if (!branchId) {
      throw new BadRequestException('branchId is required');
    }
    const branch = await this.prisma.branch.findFirst({
      where: { id: branchId, deletedAt: null },
    });
    if (!branch) {
      throw new NotFoundException('Branch not found');
    }
    return branchId;
  }

  private includeFull() {
    return {
      branch: { select: { id: true, name: true } },
      product: { select: { id: true, name: true } },
      createdBy: { select: { firstName: true, lastName: true } },
    } satisfies Prisma.DisposalInclude;
  }

  private serialize(d: any) {
    return {
      id: d.id,
      branch: d.branch ? { id: d.branch.id, name: d.branch.name } : null,
      productId: d.productId,
      name: d.productName,
      brandName: d.brandName,
      quantity: d.quantity,
      unitPrice: Number(d.unitPrice),
      value: Number(d.value),
      reason: d.reason,
      createdBy: d.createdBy
        ? `${d.createdBy.firstName} ${d.createdBy.lastName}`.trim()
        : 'System',
      createdAt: d.createdAt,
    };
  }
}
