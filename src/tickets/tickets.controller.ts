import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
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

  @Patch('/:ticketId')
  async updateTicket(
    @Param('ticketId') ticketId: number,
    @Body() ticketData: Partial<Ticket>,
  ) {
    return this.ticketsService.updateTicketInformation(ticketId, ticketData);
  }

  @Delete('/:ticketId')
  async deleteTicket(@Param('ticketId') ticketId: number) {
    return this.ticketsService.deleteTicket(ticketId);
  }
}
