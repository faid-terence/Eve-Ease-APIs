import { BadRequestException, Body, Controller, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { StripeService } from 'src/stripe/stripe.service';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly stripeService: StripeService,
  ) {}

  // Create a new payment with stripe

  @Get('/success')
  async paymentSuccessfullMessage() {
    return {
      message: 'Payment Successfull',
    };
  }
}
