import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Event from './Schema/Event.entity';
import { Repository } from 'typeorm';
import CreateEventDTO from './DTO/create-event.dto';
import UpdateEventDTO from './DTO/update-event.dto';
import Ticket from 'src/tickets/Schema/ticket.entity';
import User from 'src/user/Schema/User.entity';
import { MailService } from 'src/mail/mail.service';
import { subscribe } from 'diagnostics_channel';
import { SubscribersService } from 'src/subscribers/subscribers.service';
import { MoreThan } from 'typeorm';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(User)
    private readonly organizerRepository: Repository<User>,
    private readonly mailerService: MailService,
    private readonly subscribersServices: SubscribersService,
  ) {}

  async createEvent(
    userId: number,
    eventInformation: CreateEventDTO,
  ): Promise<Event> {
    try {
      const {
        EventName,
        EventDescription,
        EventLocation,
        EventPhoto,
        EventVenue,
        EventDate,
      } = eventInformation;

      if (
        !EventName ||
        !EventDescription ||
        !EventPhoto ||
        !EventLocation ||
        !EventVenue
      ) {
        throw new BadRequestException(
          'Invalid Event data: Required fields are missing.',
        );
      }
      const event = await this.eventRepository.findOne({
        where: { Event_Name: EventName },
      });

      if (event) {
        throw new ConflictException(
          `Event with name ${EventName} already exists`,
        );
      }
      const organizer = await this.organizerRepository.findOne({
        where: { id: userId },
        // select: ['password', 'verificationToken, isVerified', 'profilePhoto']
      });

      const newEvent = await this.eventRepository.create({
        Event_Name: EventName,
        Event_Description: EventDescription,
        Event_Location: EventLocation,
        Event_Venue: EventVenue,
        Event_Date: EventDate,
        Event_Image: EventPhoto,
        organizer: organizer,
      });

      const savedEvent = await this.eventRepository.save(newEvent);

      await this.subscribersServices.sendNotificationToSubscribers(
        savedEvent.id,
      );

      return savedEvent;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllEvents(): Promise<Event[]> {
    try {
      const currentDate = new Date();
      const events = await this.eventRepository.find({
        where: { isAvailable: true, Event_Date: MoreThan(currentDate) },
      });

      if (!events) {
        throw new NotFoundException('Events not found');
      }

      if (events.length === 0) {
        throw new NotFoundException('No events');
      }

      return events;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getSingleEvent(id: number) {
    try {
      // Fetch the event including its associated tickets
      const event = await this.eventRepository.findOne({
        where: { id },
        relations: ['tickets'], // Assuming 'tickets' is the name of the relationship
      });

      if (!event) {
        throw new NotFoundException(`Event not found`);
      }

      return event;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateEventDetails(
    organizerId,
    id: number,
    eventDetails: UpdateEventDTO,
  ) {
    try {
      const event = await this.eventRepository.findOne({
        where: { id, organizer: { id: organizerId } },
      });
      if (!event) {
        throw new NotFoundException(`Event  not found`);
      }
      if (eventDetails.EventName) {
        event.Event_Name = eventDetails.EventName;
      }
      if (eventDetails.EventDescription) {
        event.Event_Description = eventDetails.EventDescription;
      }
      if (eventDetails.EventLocation) {
        event.Event_Location = eventDetails.EventLocation;
      }
      if (eventDetails.EventVenue) {
        event.Event_Venue = eventDetails.EventVenue;
      }
      if (eventDetails.EventPhoto) {
        event.Event_Image = eventDetails.EventPhoto;
      }

      const updatedEvent = await this.eventRepository.save(event);

      return {
        message: 'Event details updated !',
        Event: updatedEvent,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteEventById(
    organizerId: number,
    id: number,
  ): Promise<{ message: string }> {
    try {
      // Find the event by id and organizerId
      const event = await this.eventRepository.findOne({
        where: { id, organizer: { id: organizerId } },
      });

      // If event is not found, throw NotFoundException
      if (!event) {
        throw new NotFoundException(`Event not found`);
      }

      // Delete associated tickets first
      await this.ticketRepository.delete({ event: { id: event.id } });

      // Then delete the event
      await this.eventRepository.delete(event);

      return {
        message: 'Event and associated tickets deleted successfully',
      };
    } catch (error) {
      // Handle errors
      throw new InternalServerErrorException(error.message);
    }
  }

  async getEventTickets(eventId: number) {
    try {
      const event = await this.eventRepository.findOne({
        where: { id: eventId },
      });
      if (!event) {
        throw new NotFoundException('Event not found');
      }
      const eventTickets = await this.ticketRepository.find({
        where: { event },
      });
      return { event, eventTickets };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async restoreEvent(id: number) {
    try {
      const event = await this.eventRepository.findOne({ where: { id } });
      if (!event) {
        throw new NotFoundException(`Event  not found`);
      }

      event.isAvailable = true;

      await this.eventRepository.save(event);
      return {
        message: 'Event restored from Archive',
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getOrganizerEvents(userId: number) {
    try {
      const events = await this.eventRepository.find({
        where: { organizer: { id: userId } },
      });

      if (!events) {
        throw new NotFoundException('No events found');
      }

      return events;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async cloneEvent(eventId: number, userId: number) {
    try {
      const event = await this.eventRepository.findOne({
        where: { id: eventId },
      });

      if (!event) {
        throw new NotFoundException('Event not found');
      }

      const organizer = await this.organizerRepository.findOne({
        where: { id: userId },
      });

      const newEvent = await this.eventRepository.create({
        Event_Name: event.Event_Name,
        Event_Description: event.Event_Description,
        Event_Location: event.Event_Location,
        Event_Venue: event.Event_Venue,
        Event_Date: event.Event_Date,
        Event_Image: event.Event_Image,
        organizer: organizer,
      });

      const savedEvent = await this.eventRepository.save(newEvent);

      return savedEvent;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async searchForEvent(searchTerm: string) {
    try {
      const events = await this.eventRepository
        .createQueryBuilder('event')
        .where('event.Event_Name ILIKE :searchTerm', {
          searchTerm: `%${searchTerm}%`,
        })
        .getMany();

      if (!events) {
        throw new NotFoundException('No events found');
      }

      return events;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
