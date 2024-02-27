import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common';
import { StripeService } from './stripe.service';

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

  @Post('/success')
  async getSuccessfulPayment(@Body('sessionId') sessionId: string) {
    try {
      return await this.stripeService.getSuccesfulPayment(sessionId);
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }
}
