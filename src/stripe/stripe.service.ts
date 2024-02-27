import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import Order from 'src/order/schema/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  async createPaymentIntent(orderId: number) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['tickets'],
    });
    // return await this.stripe.paymentIntents.create({
    //   amount: order.totalPrice * 100,
    //   currency: 'usd',
    //   metadata: { integration_check: 'accept_a_payment' },
    // });

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: order.tickets[0].category,
            },
            unit_amount: order.tickets[0].price * 100,
          },
          quantity: order.quantity,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/payment/success',
      cancel_url: 'http://localhost:3000/payment/cancel',
    });

    return {
      paymentUrl: session.url,
    };
  }

  async getSuccesfulPayment(sessionId: string) {
    return await this.stripe.checkout.sessions.retrieve(sessionId);
  }
}
