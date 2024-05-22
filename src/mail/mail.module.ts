import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import * as dotenv from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { TicketsModule } from 'src/tickets/tickets.module';
import { TicketsService } from 'src/tickets/tickets.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Ticket from 'src/tickets/Schema/ticket.entity';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TicketListener } from './ticket.listener';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: process.env.AUTH_EMAIL,
          pass: process.env.AUTH_PASS,
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
    }),
    ConfigModule,
    UserModule,
    EventEmitterModule.forRoot(),
  ],
  providers: [MailService, TicketListener],
  exports: [MailService],
})
export class MailModule {}
