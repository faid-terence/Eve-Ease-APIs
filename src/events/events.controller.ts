import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import CreateEventDTO from './DTO/create-event.dto';
import { EventsService } from './events.service';
import UpdateEventDTO from './DTO/update-event.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Request } from 'express';

@ApiTags('Event Management')
@ApiBearerAuth()
@Controller('events')
export class EventsController {
  constructor(private eventServices: EventsService) {}

  @Post('/')
  @UseGuards(AuthGuard)
  async createEvent(
    @Body() eventInfo: CreateEventDTO,
    @Req() req: Request & { user: { id: number } },
  ) {
    const userId = req.user.id;
    return this.eventServices.createEvent(userId, eventInfo);
  }

  @Get('/')
  @UseGuards(AuthGuard)
  async fetchEvents() {
    return this.eventServices.getAllEvents();
  }
  @Get('/view-archive')
  async getArchive() {
    return this.eventServices.viewArchive();
  }

  @Get('/organizer')
  @UseGuards(AuthGuard)
  async fetchOrganizerEvents(@Req() req: Request & { user: { id: number } }) {
    const userId = req.user.id;
    return this.eventServices.getOrganizerEvents(userId);
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

  @Get('/:eventId/tickets')
  async fetchTickets(@Param('eventId') eventId: number) {
    return this.eventServices.getEventTickets(eventId);
  }

  @Post('/:id/unarchive')
  async unarchiveEvent(@Param('id') id: number) {
    return this.eventServices.restoreEvent(id);
  }
}
