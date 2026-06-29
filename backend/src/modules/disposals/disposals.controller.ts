import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DisposalsService } from './disposals.service';
import { CreateDisposalDto } from './dto/create-disposal.dto';
import { QueryDisposalDto } from './dto/query-disposal.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequestUser } from '../../common/interfaces/request-user.interface';

@ApiTags('disposals')
@ApiBearerAuth()
@Controller('disposals')
@UseGuards(RolesGuard)
export class DisposalsController {
  constructor(private readonly disposalsService: DisposalsService) {}

  @Post()
  @ApiOperation({ summary: 'Record a disposal (writes off stock)' })
  async create(@Body() dto: CreateDisposalDto, @CurrentUser() user: RequestUser) {
    const data = await this.disposalsService.create(dto, user);
    return { success: true, data };
  }

  @Get()
  @ApiOperation({ summary: 'List disposals (with value summary)' })
  async findAll(@Query() query: QueryDisposalDto, @CurrentUser() user: RequestUser) {
    const result = await this.disposalsService.findAll(query, user);
    return {
      success: true,
      data: result.data,
      pagination: result.pagination,
      summary: result.summary,
    };
  }
}
