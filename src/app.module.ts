import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';
import { EventsModule } from './events/events.module';
import { TicketsModule } from './tickets/tickets.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { StripeModule } from './stripe/stripe.module';
import { SubscribersModule } from './subscribers/subscribers.module';
import { MessagesModule } from './messages/messages.module';
// import { FlutterwaveModule } from './flutterwave/flutterwave.module';
import { ReviewsModule } from './reviews/reviews.module';
import { DatabaseService } from './database/database.service';
import { DatabaseController } from './database/database.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DEV_DATABASE_URL,
      entities: ['dist/**/*.entity.js'],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    MailModule,
    EventsModule,
    TicketsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    OrderModule,
    PaymentModule,
    StripeModule,
    SubscribersModule,
    MessagesModule,
    ReviewsModule,
    // FlutterwaveModule,
  ],
  controllers: [AppController, DatabaseController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
