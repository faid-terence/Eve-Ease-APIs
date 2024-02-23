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
      const events = await this.eventRepository.find();

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
}
