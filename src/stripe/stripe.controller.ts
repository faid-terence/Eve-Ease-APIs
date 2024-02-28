import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Stripe Payment')
@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Post('/:orderId/pay')
  async createPaymentIntent(@Param('orderId') orderId: number) {
    try {
      return await this.stripeService.createPaymentIntent(orderId);
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

}
