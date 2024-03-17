import {
  BadRequestException,
  Body,
  Controller,
  Get,
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

  // fetch all payments from stripe
  @Get('/payments')
  async fetchAllPayments() {
    try {
      return await this.stripeService.fetchAllPayments();
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  // fetch a single payment from stripe
  @Get('/payments/:paymentId')
  async fetchSinglePayment(@Param('paymentId') paymentId: string) {
    try {
      return await this.stripeService.fetchSinglePayment(paymentId);
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  // automatically send ticket to user after payment


}
