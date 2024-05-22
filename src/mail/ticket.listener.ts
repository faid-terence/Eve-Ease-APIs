import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserService } from '../user/user.service';
import { TicketPurchasedEvent } from './ticket-purchased.event';

@Injectable()
export class TicketListener {
  constructor(private readonly userService: UserService) {}

  @OnEvent('ticket.purchased')
  async handleTicketPurchasedEvent(event: TicketPurchasedEvent) {
    await this.userService.updateUserTickets(event.userEmail, event.tickets);
  }
}
