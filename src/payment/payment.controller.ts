import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { StripeService } from 'src/stripe/stripe.service';
import { ApiTags } from '@nestjs/swagger';
import { OrderService } from 'src/order/order.service';

@ApiTags('Stripe Payment')
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly stripeService: StripeService,
    private readonly orderService: OrderService,
  ) {}

  // Create a new payment with stripe

  @Get('/success/:orderId')
  async paymentSuccessfullMessage(@Param('orderId') orderId: number) {
    try {
      const status = 'completed';
      await this.orderService.updateOrderStatus(orderId);

      return {
        message: 'Payment Successful. Order status updated to completed.',
      };
    } catch (error) {
      return {
        message: 'Failed to update order status.',
        error: error.message,
      };
    }
  }
}
