import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createClientDto: CreateClientDto) {
    try {
      return await this.prisma.client.create({
        data: createClientDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            'A client with this email, GST, or PAN already exists',
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
    const where: Prisma.ClientWhereInput = {
      organizationId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search } },
          { gst: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const skip = (page - 1) * limit;
    const [total, items] = await Promise.all([
      this.prisma.client.count({ where }),
      this.prisma.client.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          deployments: {
            include: {
              associate: true,
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
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: {
        deployments: {
          include: {
            associate: true,
          },
          orderBy: {
            startDate: 'desc',
          },
        },
      },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    try {
      return await this.prisma.client.update({
        where: { id },
        data: updateClientDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            'A client with this email, GST, or PAN already exists',
          );
        }
        if (error.code === 'P2025') {
          throw new NotFoundException(`Client with ID ${id} not found`);
        }
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.client.delete({
        where: { id },
      });
      return { message: 'Client deleted successfully' };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Client with ID ${id} not found`);
        }
      }
      throw error;
    }
  }
}