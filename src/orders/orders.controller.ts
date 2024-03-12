import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  Query,
  Patch,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ORDERS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { OrderPaginationDto } from 'src/common/dto/order-pagination.dto';
import { PaginationDto } from 'src/common/dto';
import { StatusDto } from './dto';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDERS_SERVICE) private readonly ordersClient: ClientProxy,
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send('create_order', createOrderDto);
  }

  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.ordersClient.send('find_all_orders', orderPaginationDto);
  }

  @Get('id/:id')
  async findOne(@Param('id') id: string) {
    try {
      const order = await firstValueFrom(
        this.ordersClient.send('find_one_order', id),
      );

      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':status')
  async findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.ordersClient.send('find_all_orders', {
      ...paginationDto,
      status: statusDto.status,
    });
  }

  @Patch(':id')
  changeOrderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto,
  ) {
    try {
      const updated = firstValueFrom(
        this.ordersClient.send('change_order_status', {
          id,
          status: statusDto.status,
        }),
      );

      return updated;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
