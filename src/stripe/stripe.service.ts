import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import Order from 'src/order/schema/order.entity';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  async createPaymentIntent(order: Order) {
    return await this.stripe.paymentIntents.create({
      amount: order.totalPrice * 100,
      currency: 'usd',
      metadata: { integration_check: 'accept_a_payment' },
    });
  }
}
