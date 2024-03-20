import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Ticket from './Schema/ticket.entity';
import Event from 'src/events/Schema/Event.entity';
import { MailService } from 'src/mail/mail.service';
import User from 'src/user/Schema/User.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,

    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    private readonly mailServices: MailService,

    @InjectRepository(User)
    private organizerRepository: Repository<User>,
  ) {}

  // organizer create tickets for their own events

  async createTicket(
    eventId: number,
    ticketData: Partial<Ticket>,
    userId: number,
  ) {
    try {
      const event = await this.eventRepository.findOne({
        where: { id: eventId },
        relations: ['organizer'],
      });
      if (!event) {
        throw new NotFoundException('Event not found');
      }

      const organizer = event.organizer;

      if (!organizer || organizer.id !== userId) {
        throw new ForbiddenException(
          'You are not authorized to create a ticket for this event',
        );
      }

      const ticket = this.ticketRepository.create(ticketData);
      ticket.event = event;
      const newTicket = await this.ticketRepository.save(ticket);
      return {
        message: 'Ticket created successfully',
        newTicket,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async fetchTickets() {
    try {
      const tickets = await this.ticketRepository.find();
      return tickets;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getTicketById(ticketId: number) {
    try {
      const ticket = await this.ticketRepository.findOne({
        where: { id: ticketId },
      });
      if (!ticket) {
        throw new NotFoundException('Ticket not found');
      }
      return ticket;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateTicketInformation(ticketId: number, ticketData: Partial<Ticket>) {
    try {
      const ticket = await this.ticketRepository.findOne({
        where: { id: ticketId },
      });
      if (!ticket) {
        throw new NotFoundException('Ticket not found');
      }
      if (ticketData.category) {
        ticket.category = ticketData.category;
      }
      if (ticketData.price) {
        ticket.price = ticketData.price;
      }
      if (ticketData.availableQuantity) {
        ticket.availableQuantity = ticketData.availableQuantity;
      }
      const updatedTicket = await this.ticketRepository.save(ticket);
      return {
        message: 'Ticket updated successfully',
        updatedTicket,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteTicket(ticketId: number) {
    try {
      const ticket = await this.ticketRepository.findOne({
        where: { id: ticketId },
      });
      if (!ticket) {
        throw new NotFoundException('Ticket not found');
      }
      await this.ticketRepository.delete(ticket);
      return {
        message: 'Ticket deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // send ticket to user after payment

  async sendTicketToUser(ticketData: any, email: string) {
    try {
      await this.mailServices.sendTicketToUser(ticketData, email);
      return {
        message: 'Ticket sent to the user successfully.',
      };
    } catch (error) {}
  }

  // fetch organizer tickets with event details

  async fetchOrganizerTickets(userId: number) {
    try {
      const organizer = await this.organizerRepository.findOne({
        where: { id: userId },
      });
      if (!organizer) {
        throw new NotFoundException('Organizer not found');
      }
      const tickets = await this.ticketRepository.find({
        where: { event: { organizer } },
        relations: ['event'],
      });
      return tickets;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
