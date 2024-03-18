import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Ticket from './Schema/ticket.entity';
import Event from 'src/events/Schema/Event.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,

    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    private readonly mailServices: MailService,
  ) {}

  async createTicket(eventId: number, ticketData: Partial<Ticket>) {
    const { category, price, availableQuantity } = ticketData;
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    const ticket = this.ticketRepository.create({
      category,
      price,
      availableQuantity,
      event,
    });

    const newTicket = await this.ticketRepository.save(ticket);

    return newTicket;
  }

  // async getAllTickets(eventId: number) {
  //   const event = await this.eventRepository.findOne({
  //     where: { id: eventId },
  //     relations: ['tickets'],
  //   });

  //   if (!event) {
  //     throw new Error('Event not found');
  //   }

  //   return event.tickets;
  // }

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
}
