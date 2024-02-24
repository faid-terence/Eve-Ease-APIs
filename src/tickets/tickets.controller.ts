import { Body, Controller, Param, Post } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import Ticket from './Schema/ticket.entity';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('/:eventId')
  async createTicket(
    @Param('eventId') eventId: number,
    @Body() ticketData: Partial<Ticket>,
  ) {
    return this.ticketsService.createTicket(eventId, ticketData);
  }
}
