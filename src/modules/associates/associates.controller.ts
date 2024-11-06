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
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AssociatesService } from './associates.service';
import { CreateAssociateDto, UpdateAssociateDto } from './dto/associate.dto';
import { AuthGuard } from '../../common/guards/auth.guard';

@ApiTags('Associates')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('associates')
export class AssociatesController {
  constructor(private readonly associatesService: AssociatesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new associate' })
  @ApiResponse({ status: 201, description: 'Associate created successfully' })
  create(@Body() createAssociateDto: CreateAssociateDto) {
    return this.associatesService.create(createAssociateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all associates for an organization' })
  findAll(
    @Query('organizationId') organizationId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ) {
    return this.associatesService.findAll(organizationId, page, limit, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get associate by ID' })
  findOne(@Param('id') id: string) {
    return this.associatesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update associate by ID' })
  update(
    @Param('id') id: string,
    @Body() updateAssociateDto: UpdateAssociateDto,
  ) {
    return this.associatesService.update(id, updateAssociateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete associate by ID' })
  remove(@Param('id') id: string) {
    return this.associatesService.remove(id);
  }
}