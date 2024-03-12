import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatusList, OrderStatus } from '../enum/order.enum';

export class StatusDto {
  @IsEnum(OrderStatusList, {
    message: `Status must be one of the following: ${OrderStatusList.join(', ')}`,
  })
  @IsOptional()
  status: OrderStatus;
}
