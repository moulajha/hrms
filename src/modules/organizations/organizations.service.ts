import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto/organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrganizationDto: CreateOrganizationDto) {
    return this.prisma.organization.create({
      data: createOrganizationDto,
    });
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [total, items] = await Promise.all([
      this.prisma.organization.count(),
      this.prisma.organization.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            associates: true,
            clients: true,
            deployments: true,
          },
        },
      },
    });

    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }

    return organization;
  }

  async update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    try {
      return await this.prisma.organization.update({
        where: { id },
        data: updateOrganizationDto,
      });
    } catch (error) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.organization.delete({
        where: { id },
      });
      return { message: 'Organization deleted successfully' };
    } catch (error) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
  }
}