import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Payment from './schema/payment.entity';
import Order from 'src/order/schema/order.entity';
import { StripeService } from 'src/stripe/stripe.service';
import { OrderService } from 'src/order/order.service';
import Ticket from 'src/tickets/Schema/ticket.entity';
import User from 'src/user/Schema/User.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Order, Ticket, User])],
  providers: [PaymentService, StripeService, OrderService],
  controllers: [PaymentController],
})
export class PaymentModule {}
