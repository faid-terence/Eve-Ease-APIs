import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Payment from './schema/payment.entity';
import { Repository } from 'typeorm';
import Order from 'src/order/schema/order.entity';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
  ) {}

  // Create a new payment with stripe

  async createPaymentWithStripe(
    orderId: number,
    amount: number,
    currency: string,
    description: string,
  ) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    if (!order) {
      throw new Error('Order not found');
    }
    const payment = new Payment();
    payment.amount = amount;
    payment.currency = currency;
    payment.description = description;
    payment.status = 'pending';
    return this.paymentRepository.save(payment);
  }
}
