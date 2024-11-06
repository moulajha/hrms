import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DeploymentsService } from './deployments.service';
import { CreateDeploymentDto, UpdateDeploymentDto } from './dto/deployment.dto';
import { AuthGuard } from '../../common/guards/auth.guard';

@ApiTags('Deployments')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('deployments')
export class DeploymentsController {
  constructor(private readonly deploymentsService: DeploymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new deployment' })
  @ApiResponse({ status: 201, description: 'Deployment created successfully' })
  create(@Body() createDeploymentDto: CreateDeploymentDto) {
    return this.deploymentsService.create(createDeploymentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all deployments for an organization' })
  findAll(
    @Query('organizationId') organizationId: string,
    @Query('status') status?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.deploymentsService.findAll(organizationId, status, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get deployment by ID' })
  findOne(@Param('id') id: string) {
    return this.deploymentsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update deployment by ID' })
  update(
    @Param('id') id: string,
    @Body() updateDeploymentDto: UpdateDeploymentDto,
  ) {
    return this.deploymentsService.update(id, updateDeploymentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete deployment by ID' })
  remove(@Param('id') id: string) {
    return this.deploymentsService.remove(id);
  }
}