import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { StripeService } from './stripe.service';
import Order from 'src/order/schema/order.entity';

@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Post('/pay')
  async createPaymentIntent(@Body() order: Order) {
    try {
      return await this.stripeService.createPaymentIntent(order);
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }
}
