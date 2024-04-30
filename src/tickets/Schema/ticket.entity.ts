import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Event from '../../events/Schema/Event.entity';

@Entity()
export default class Ticket {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Event, (event) => event.tickets)
  @JoinColumn({ name: 'event_id' })
  event: Event;
  @Column()
  category: string;

  @Column()
  price: number;

  @Column()
  availableQuantity: number;

  @Column({ default: 0 })
  soldQuantity: number;

  @Column()
  companyLogo: string;

  @Column({ default: false })
  isVerified: boolean;
}
