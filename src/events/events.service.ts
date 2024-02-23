import { ConflictException, Injectable } from '@nestjs/common';
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
    const {
      EventName,
      EventDescription,
      EventLocation,
      EventVenue,
      EventDate,
    } = eventInformation;
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
    });

    const savedEvent = await this.eventRepository.save(newEvent);

    return savedEvent;
  }
}
