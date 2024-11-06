import { IsString, IsUUID, IsNumber, IsDate, IsEnum, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { DeploymentStatus } from '@prisma/client';

export class CreateDeploymentDto {
  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  billRate: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  payRate: number;

  @ApiProperty({ enum: DeploymentStatus, default: DeploymentStatus.ACTIVE })
  @IsEnum(DeploymentStatus)
  status: DeploymentStatus;

  @ApiProperty()
  @IsUUID()
  organizationId: string;

  @ApiProperty()
  @IsUUID()
  associateId: string;

  @ApiProperty()
  @IsUUID()
  clientId: string;
}

export class UpdateDeploymentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  billRate?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  payRate?: number;

  @ApiProperty({ enum: DeploymentStatus, required: false })
  @IsOptional()
  @IsEnum(DeploymentStatus)
  status?: DeploymentStatus;
}