import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Order from './schema/order.entity';
import { Repository } from 'typeorm';
import Ticket from 'src/tickets/Schema/ticket.entity';
import User from 'src/user/Schema/User.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createOrder(ticketId: number, userId: number, quantity: number) {
    const ticket = await this.ticketRepository.findOne({
      where: { id: ticketId },
    });
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const totalPrice = ticket.price * quantity;
    const order = this.orderRepository.create({
      tickets: [ticket],
      user,
      quantity,
      totalPrice,
      orderDate: new Date(),
    });
    return this.orderRepository.save(order);
  }
}
