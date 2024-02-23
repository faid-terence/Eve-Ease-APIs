import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
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
  async fetchEvent(@Param('id') id: number) {
    return this.eventServices.getSingleEvent(id);
  }

  @Patch('/:id')
  async updateEvent(
    @Param('id') id: number,
    @Body() eventInfo: UpdateEventDTO,
  ) {
    return this.eventServices.updateEventDetails(id, eventInfo);
  }

  @Delete('/:id')
  async deleteEvent(@Param('id') id: number) {
    return this.eventServices.deleteEventById(id);
  }

  @Post('/:id/archive')
  async archiveEvent(@Param('id') id: number) {
    return this.eventServices.archieveEvent(id);
  }
}
