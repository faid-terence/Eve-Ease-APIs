import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Ticket from './Schema/ticket.entity';
import Event from 'src/events/Schema/Event.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,

    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
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
}
