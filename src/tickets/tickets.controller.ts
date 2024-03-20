import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import Ticket from './Schema/ticket.entity';
import { ApiTags } from '@nestjs/swagger';
import { MailService } from 'src/mail/mail.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Request } from 'express';

@ApiTags('Ticket Management')
@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly mailServices: MailService,
  ) {}

  @Get('')
  async fetchTickets() {
    return this.ticketsService.fetchTickets();
  }

  @Get('/organizer')
  @UseGuards(AuthGuard)
  async fetchOrganizerTickets(@Req() req: Request & { user: { id: number } }) {
    const userId = req.user.id;
    return this.ticketsService.fetchOrganizerTickets(userId);
  }
  @Put('/send-ticket')
  async generateAndSendTicketByEmail(
    @Body('eventName') eventName: string,
    @Body('email') email: string,
  ) {
    try {
      const pdfPath = await this.mailServices.generateTicketPDF(eventName);
      await this.mailServices.sendTicketByEmail(email, pdfPath);
      return { message: 'Ticket sent successfully' };
    } catch (error) {
      return { error: 'Error generating or sending ticket' };
    }
  }

  @Post('/:eventId')
  @UseGuards(AuthGuard)
  async createTicket(
    @Param('eventId') eventId: number,
    @Body() ticketData: Partial<Ticket>,
    @Req() req: Request & { user: { id: number } },
  ) {
    const userId = req.user.id;
    return this.ticketsService.createTicket(eventId, ticketData, userId);
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
