import { Module } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Order from 'src/order/schema/order.entity';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TypeOrmModule.forFeature([Order])],
  controllers: [StripeController],
  providers: [StripeService, MailService],
})
export class StripeModule {}
