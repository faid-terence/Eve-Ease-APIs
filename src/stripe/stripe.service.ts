import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import Order from 'src/order/schema/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    private readonly mailServices: MailService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }
  async createPaymentIntent(orderId: number) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['tickets'],
      order: { orderDate: 'DESC' },
    });

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
      success_url: `http://localhost:3000/payment/success/:${orderId}`,
      cancel_url: 'http://localhost:3000/payment/cancel',
    });

    // Assuming session creation and payment confirmation
    // Update order's isPaid property to true
    order.isPaid = true;
    await this.orderRepository.save(order);

    return {
      paymentUrl: session.url,
    };
  }

  async sendUserTicketAfterPayment(orderId: number, email: string) {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
        relations: ['tickets'],
      });

      if (!order) {
        throw new Error('Order not found.');
      }

      if (order.isPaid) {
        return {
          message: 'Ticket has already been sent to the user.',
        };
      }

      order.isPaid = true;
      await this.orderRepository.save(order);

      // Send ticket to user
      await this.mailServices.sendTicketPdfAfterPayment(email);

      return {
        message: 'Ticket sent to the user successfully.',
      };
    } catch (error) {
      // Log error or handle appropriately
      console.error('Error sending ticket:', error);
      throw new Error('Failed to send ticket. Please try again later.');
    }
  }

  async getSuccesfulPayment(sessionId: string) {
    return await this.stripe.checkout.sessions.retrieve(sessionId);
  }

  // fetch all payments from stripe

  async fetchAllPayments() {
    return await this.stripe.paymentIntents.list();
  }

  // fetch a single payment from stripe
  async fetchSinglePayment(paymentId: string) {
    return await this.stripe.paymentIntents.retrieve(paymentId);
  }

  // automatically send ticket to user after payment

  async sendTicketToUser(orderId: number): Promise<{ message: string }> {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
        relations: ['tickets'],
      });

      if (!order) {
        throw new Error('Order not found.');
      }

      if (order.isPaid) {
        return {
          message: 'Ticket has already been sent to the user.',
        };
      }

      order.isPaid = true;
      await this.orderRepository.save(order);

      return {
        message: 'Ticket sent to the user successfully.',
      };
    } catch (error) {
      // Log error or handle appropriately
      console.error('Error sending ticket:', error);
      throw new Error('Failed to send ticket. Please try again later.');
    }
  }
}
