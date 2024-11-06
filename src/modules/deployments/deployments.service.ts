import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateDeploymentDto, UpdateDeploymentDto } from './dto/deployment.dto';
import { Prisma, DeploymentStatus } from '@prisma/client';

@Injectable()
export class DeploymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDeploymentDto: CreateDeploymentDto) {
    // Check if associate is already deployed
    const activeDeployment = await this.prisma.deployment.findFirst({
      where: {
        associateId: createDeploymentDto.associateId,
        status: DeploymentStatus.ACTIVE,
      },
    });

    if (activeDeployment) {
      throw new BadRequestException('Associate is already deployed');
    }

    // Validate dates
    if (createDeploymentDto.endDate && createDeploymentDto.startDate >= createDeploymentDto.endDate) {
      throw new BadRequestException('End date must be after start date');
    }

    return this.prisma.deployment.create({
      data: createDeploymentDto,
      include: {
        associate: true,
        client: true,
      },
    });
  }

  async findAll(
    organizationId: string,
    status?: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const where: Prisma.DeploymentWhereInput = {
      organizationId,
      ...(status && { status: status as DeploymentStatus }),
    };

    const skip = (page - 1) * limit;
    const [total, items] = await Promise.all([
      this.prisma.deployment.count({ where }),
      this.prisma.deployment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startDate: 'desc' },
        include: {
          associate: true,
          client: true,
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
    const deployment = await this.prisma.deployment.findUnique({
      where: { id },
      include: {
        associate: true,
        client: true,
      },
    });

    if (!deployment) {
      throw new NotFoundException(`Deployment with ID ${id} not found`);
    }

    return deployment;
  }

  async update(id: string, updateDeploymentDto: UpdateDeploymentDto) {
    // Validate end date if provided
    if (updateDeploymentDto.endDate) {
      const deployment = await this.prisma.deployment.findUnique({
        where: { id },
      });

      if (!deployment) {
        throw new NotFoundException(`Deployment with ID ${id} not found`);
      }

      if (deployment.startDate >= updateDeploymentDto.endDate) {
        throw new BadRequestException('End date must be after start date');
      }
    }

    try {
      return await this.prisma.deployment.update({
        where: { id },
        data: updateDeploymentDto,
        include: {
          associate: true,
          client: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Deployment with ID ${id} not found`);
        }
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.deployment.delete({
        where: { id },
      });
      return { message: 'Deployment deleted successfully' };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Deployment with ID ${id} not found`);
        }
      }
      throw error;
    }
  }
}