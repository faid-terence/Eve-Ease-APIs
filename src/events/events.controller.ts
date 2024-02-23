import { Body, Controller, Post } from '@nestjs/common';
import CreateEventDTO from './DTO/create-event.dto';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private eventServices: EventsService) {}

  @Post('/')
  async createEvent(@Body() eventInfo: CreateEventDTO) {
    return this.eventServices.createEvent(eventInfo);
  }
}
