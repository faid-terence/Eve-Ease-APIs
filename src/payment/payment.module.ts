import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Payment from './schema/payment.entity';
import Order from 'src/order/schema/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Order])],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
