import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import CreateEventDTO from './DTO/create-event.dto';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private eventServices: EventsService) {}

  @Post('/')
  async createEvent(@Body() eventInfo: CreateEventDTO) {
    return this.eventServices.createEvent(eventInfo);
  }

  @Get('/')
  async fetchEvents() {
    return this.eventServices.getAllEvents();
  }

  @Get('/:id')
  async fetchEvent(@Param('eventId') eventId: number) {
    return this.eventServices.getSingleEvent(eventId);
  }
}
