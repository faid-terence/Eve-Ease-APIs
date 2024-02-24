import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import Ticket from './Schema/ticket.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Ticket Management')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get('')
  async fetchTickets() {
    return this.ticketsService.fetchTickets();
  }

  @Post('/:eventId')
  async createTicket(
    @Param('eventId') eventId: number,
    @Body() ticketData: Partial<Ticket>,
  ) {
    return this.ticketsService.createTicket(eventId, ticketData);
  }
  // @Get('/:eventId')
  // async getAllTickets(@Param('eventId') eventId: number) {
  //   return this.ticketsService.getAllTickets(eventId);
  // }

  @Get('/:ticketId')
  async getTicket(@Param('ticketId') ticketId: number) {
    return this.ticketsService.getTicketById(ticketId);
  }
}
