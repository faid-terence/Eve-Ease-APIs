import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Event from './Schema/Event.entity';
import Ticket from 'src/tickets/Schema/ticket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Ticket])],
  providers: [EventsService],
  controllers: [EventsController],
})
export class EventsModule {}
