import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import Ticket from 'src/tickets/Schema/ticket.entity';
import User from 'src/user/Schema/User.entity';

@Entity()
export default class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Ticket)
  @JoinTable()
  tickets: Ticket[];

  @ManyToOne(() => User)
  user: User;

  @Column()
  quantity: number;

  @Column()
  totalPrice: number;

  @Column()
  orderDate: Date;

  @Column({ default: false })
  isPaid: boolean;
}
