import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Order from './schema/order.entity';
import Ticket from 'src/tickets/Schema/ticket.entity';
import User from 'src/user/Schema/User.entity';
import { AuthModule } from 'src/auth/auth.module';
import { StripeService } from 'src/stripe/stripe.service';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Ticket, User]), AuthModule],
  providers: [OrderService, StripeService, MailService],
  controllers: [OrderController],
})
export class OrderModule {}
