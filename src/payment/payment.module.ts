import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Payment from './schema/payment.entity';
import Order from 'src/order/schema/order.entity';
import { StripeService } from 'src/stripe/stripe.service';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Order])],
  providers: [PaymentService, StripeService],
  controllers: [PaymentController],
})
export class PaymentModule {}
