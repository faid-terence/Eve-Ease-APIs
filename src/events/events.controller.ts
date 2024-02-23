import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import CreateEventDTO from './DTO/create-event.dto';
import { EventsService } from './events.service';
import UpdateEventDTO from './DTO/update-event.dto';

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

  @Patch('/:id')
  async updateEvent(
    @Param('eventId') eventId: number,
    @Body() eventInfo: UpdateEventDTO,
  ) {
    return this.eventServices.updateEventDetails(eventId, eventInfo);
  }
}
