import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateAssociateDto, UpdateAssociateDto } from './dto/associate.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AssociatesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAssociateDto: CreateAssociateDto) {
    try {
      return await this.prisma.associate.create({
        data: createAssociateDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            'An associate with this email, Aadhaar, or PAN already exists',
          );
        }
      }
      throw error;
    }
  }

  async findAll(
    organizationId: string,
    page: number,
    limit: number,
    search?: string,
  ) {
    const where: Prisma.AssociateWhereInput = {
      organizationId,
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search } },
        ],
      }),
    };

    const skip = (page - 1) * limit;
    const [total, items] = await Promise.all([
      this.prisma.associate.count({ where }),
      this.prisma.associate.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          deployments: {
            include: {
              client: true,
            },
            where: {
              status: 'ACTIVE',
            },
          },
        },
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
    const associate = await this.prisma.associate.findUnique({
      where: { id },
      include: {
        deployments: {
          include: {
            client: true,
          },
          orderBy: {
            startDate: 'desc',
          },
        },
      },
    });

    if (!associate) {
      throw new NotFoundException(`Associate with ID ${id} not found`);
    }

    return associate;
  }

  async update(id: string, updateAssociateDto: UpdateAssociateDto) {
    try {
      return await this.prisma.associate.update({
        where: { id },
        data: updateAssociateDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            'An associate with this email, Aadhaar, or PAN already exists',
          );
        }
        if (error.code === 'P2025') {
          throw new NotFoundException(`Associate with ID ${id} not found`);
        }
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.associate.delete({
        where: { id },
      });
      return { message: 'Associate deleted successfully' };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Associate with ID ${id} not found`);
        }
      }
      throw error;
    }
  }
}