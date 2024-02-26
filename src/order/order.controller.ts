import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  UseGuards,
  Get,
  Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Order Management')
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('/:ticketId')
  @UseGuards(AuthGuard)
  async createOrder(
    @Param('ticketId') ticketId: number,
    @Req() req: Request & { user: { id: number } },
    @Body('quantity') quantity: number,
  ) {
    return this.orderService.createOrder(ticketId, req.user.id, quantity);
  }

  @Get('/')
  @UseGuards(AuthGuard)
  async viewOrders(@Req() req: Request & { user: { id: number } }) {
    return this.orderService.viewOrders(req.user.id);
  }

  @Get('/all')
  async viewAllOrders() {
    return this.orderService.viewAllOrders();
  }

  @Post('/:orderId/status')
  @UseGuards(AuthGuard) // to be changed to admin guard
  async updateOrderStatus(
    @Param('orderId') orderId: number,
    @Req() req: Request & { user: { id: number } },
    @Body('status') status: string,
  ) {
    return this.orderService.updateOrderStatus(orderId, status);
  }

  @Delete('/:orderId')
  @UseGuards(AuthGuard) // to be changed to admin guard
  async deleteOrder(
    @Param('orderId') orderId: number,
    @Req() req: Request & { user: { id: number } },
  ) {
    return this.orderService.deleteOrder(orderId);
  }

  @Get('/:orderId')
  @UseGuards(AuthGuard)
  async viewOrder(
    @Param('orderId') orderId: number,
    @Req() req: Request & { user: { id: number } },
  ) {
    return this.orderService.getOrderById(orderId);
  }
}
