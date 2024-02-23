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

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async createEvent(eventInformation: CreateEventDTO): Promise<Event> {
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

      const newEvent = await this.eventRepository.create({
        Event_Name: EventName,
        Event_Description: EventDescription,
        Event_Location: EventLocation,
        Event_Venue: EventVenue,
        Event_Date: EventDate,
        Event_Image: EventPhoto,
      });

      const savedEvent = await this.eventRepository.save(newEvent);

      return savedEvent;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllEvents(): Promise<Event[]> {
    try {
      const events = await this.eventRepository.find({
        where: { isAvailable: true },
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

  async getSingleEvent(eventId: number) {
    try {
      const event = await this.eventRepository.findOne({
        where: { id: eventId },
      });
      if (!event) {
        throw new NotFoundException(`Event with id ${eventId} not found`);
      }

      return event;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateEventDetails(eventId: number, eventDetails: UpdateEventDTO) {
    try {
      const event = await this.eventRepository.findOneBy({ id: eventId });
      if (!event) {
        throw new NotFoundException(`Event with id ${eventId} not found`);
      }
      if (eventDetails.EventName) {
        event.Event_Name = eventDetails.EventName;
      }
      if (eventDetails.EventDescription) {
        event.Event_Description = eventDetails.EventDescription;
      }
      if (eventDetails.EventLocation) {
        event.Event_Location = eventDetails.EventDescription;
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

  async deleteEventById(eventId: number): Promise<{ message: string }> {
    try {
      const event = await this.eventRepository.findOneBy({ id: eventId });
      if (!event) {
        throw new NotFoundException(`Event with id ${eventId} not found`);
      }

      await this.eventRepository.delete(event);

      return {
        message: 'Event deleted successful',
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async archieveEvent(eventId: number) {
    try {
      const event = await this.eventRepository.findOneBy({ id: eventId });
      if (!event) {
        throw new NotFoundException(`Event with id ${eventId} not found`);
      }

      event.isAvailable = false;

      await this.eventRepository.save(event);
      return {
        message: 'Event sent to Archive',
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
