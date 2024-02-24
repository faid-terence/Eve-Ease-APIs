import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from 'typeorm';
import Ticket from '../../tickets/Schema/ticket.entity';

@Entity()
@Unique(['Event_Name'])
export default class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  Event_Name: string;

  @Column()
  Event_Image: string;

  @Column()
  Event_Description: string;

  @Column()
  Event_Location: string;

  @Column()
  Event_Venue: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  Event_Date: Date;

  @Column({ default: false })
  isFree: boolean;

  @Column({ default: true })
  isAvailable: boolean;

  @OneToMany(() => Ticket, (ticket) => ticket.event)
  tickets: Ticket[];
}
