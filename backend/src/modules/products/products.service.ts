import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto, BranchQuantityDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { slugify } from '../../common/utils/string.util';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto, createdBy: string) {
    const brand = await this.prisma.brand.findFirst({
      where: { id: dto.brandId, deletedAt: null },
    });
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    await this.assertBranchesExist(dto.quantities);

    const product = await this.prisma.product.create({
      data: {
        name: dto.name.trim(),
        slug: slugify(dto.name),
        image: dto.image?.trim() || null,
        brandId: dto.brandId,
        sellingPrice: dto.sellingPrice,
        quantityAlert: dto.quantityAlert ?? 0,
        inventory: dto.quantities?.length
          ? {
              create: dto.quantities.map((q) => ({
                branchId: q.branchId,
                quantity: q.quantity,
              })),
            }
          : undefined,
      },
      include: this.includeFull(),
    });

    await this.audit(createdBy, 'PRODUCT_CREATED', product.id, null, {
      name: product.name,
      brand: brand.name,
    });

    return this.serialize(product);
  }

  async findAll(query: QueryProductDto) {
    const { page = 1, limit = 20, search, brandId, branchId } = query;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    if (brandId) {
      where.brandId = brandId;
    }

    const [total, products] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        include: this.includeFull(branchId),
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: products.map((p) => this.serialize(p)),
      pagination: this.paginate(page, limit, total),
    };
  }

  async findArchived(query: QueryProductDto) {
    const { page = 1, limit = 20, search } = query;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: { not: null } };
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const [total, products] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        include: this.includeFull(),
        orderBy: { deletedAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: products.map((p) => this.serialize(p)),
      pagination: this.paginate(page, limit, total),
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
      include: this.includeFull(),
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.serialize(product);
  }

  async update(id: string, dto: UpdateProductDto, updatedBy: string) {
    const current = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
    });
    if (!current) {
      throw new NotFoundException('Product not found');
    }

    if (dto.brandId) {
      const brand = await this.prisma.brand.findFirst({
        where: { id: dto.brandId, deletedAt: null },
      });
      if (!brand) {
        throw new NotFoundException('Brand not found');
      }
    }

    await this.assertBranchesExist(dto.quantities);

    const data: any = {};
    if (dto.name !== undefined) {
      data.name = dto.name.trim();
      data.slug = slugify(dto.name);
    }
    if (dto.image !== undefined) data.image = dto.image?.trim() || null;
    if (dto.brandId !== undefined) data.brandId = dto.brandId;
    if (dto.sellingPrice !== undefined) data.sellingPrice = dto.sellingPrice;
    if (dto.quantityAlert !== undefined) data.quantityAlert = dto.quantityAlert;

    await this.prisma.product.update({ where: { id }, data });

    // Upsert per-branch quantities when provided.
    if (dto.quantities?.length) {
      for (const q of dto.quantities) {
        await this.prisma.inventory.upsert({
          where: { productId_branchId: { productId: id, branchId: q.branchId } },
          create: { productId: id, branchId: q.branchId, quantity: q.quantity },
          update: { quantity: q.quantity },
        });
      }
    }

    const updated = await this.prisma.product.findUnique({
      where: { id },
      include: this.includeFull(),
    });

    await this.audit(
      updatedBy,
      'PRODUCT_UPDATED',
      id,
      { name: current.name },
      data,
    );

    return this.serialize(updated!);
  }

  async remove(id: string, deletedBy: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });

    await this.audit(
      deletedBy,
      'PRODUCT_ARCHIVED',
      id,
      { name: product.name },
      null,
    );

    return { message: 'Product archived successfully' };
  }

  async restore(id: string, restoredBy: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, deletedAt: { not: null } },
      include: { brand: true },
    });
    if (!product) {
      throw new NotFoundException('Archived product not found');
    }
    if (product.brand.deletedAt) {
      throw new BadRequestException(
        'Cannot restore: the product brand is archived. Restore the brand first.',
      );
    }

    await this.prisma.product.update({
      where: { id },
      data: { deletedAt: null, isActive: true },
    });

    await this.audit(restoredBy, 'PRODUCT_RESTORED', id, null, {
      name: product.name,
    });

    return this.findOne(id);
  }

  private async assertBranchesExist(quantities?: BranchQuantityDto[]) {
    if (!quantities?.length) return;
    const ids = [...new Set(quantities.map((q) => q.branchId))];
    const found = await this.prisma.branch.count({
      where: { id: { in: ids }, deletedAt: null },
    });
    if (found !== ids.length) {
      throw new BadRequestException('One or more branches do not exist');
    }
  }

  private includeFull(branchId?: string) {
    return {
      brand: { select: { id: true, name: true, slug: true } },
      inventory: {
        where: branchId ? { branchId } : undefined,
        include: { branch: { select: { id: true, name: true } } },
      },
    };
  }

  private serialize(product: any) {
    const quantities = (product.inventory ?? []).map((inv: any) => ({
      branchId: inv.branchId,
      branchName: inv.branch?.name ?? null,
      quantity: inv.quantity,
    }));
    const totalQuantity = quantities.reduce(
      (sum: number, q: any) => sum + q.quantity,
      0,
    );

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      brand: product.brand
        ? { id: product.brand.id, name: product.brand.name, slug: product.brand.slug }
        : null,
      sellingPrice: Number(product.sellingPrice),
      quantityAlert: product.quantityAlert,
      isActive: product.isActive,
      quantities,
      totalQuantity,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      deletedAt: product.deletedAt,
    };
  }

  private paginate(page: number, limit: number, total: number) {
    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      hasNext: page * limit < total,
      hasPrev: page > 1,
    };
  }

  private audit(
    userId: string,
    action: string,
    entityId: string,
    oldValues: any,
    newValues: any,
  ) {
    return this.prisma.auditLog.create({
      data: {
        userId,
        action,
        entityType: 'Product',
        entityId,
        oldValues: oldValues ?? undefined,
        newValues: newValues ?? undefined,
      },
    });
  }
}
