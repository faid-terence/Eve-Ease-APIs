import { BadRequestException, Injectable } from '@nestjs/common';
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

  async viewOrders(userId: number) {
    try {
      return this.orderRepository.find({
        where: { user: { id: userId } },
        relations: ['tickets'],
      });
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async viewAllOrders() {
    try {
      return this.orderRepository.find({ relations: ['tickets', 'user'] });
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async updateOrderStatus(orderId: number, status: string) {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
      });
      if (!order) {
        return new BadRequestException('Order not found');
      }
      order.status = status;
      return this.orderRepository.save(order);
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async deleteOrder(orderId: number) {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
      });
      if (!order) {
        return new BadRequestException('Order not found');
      }
      return this.orderRepository.delete({ id: orderId });
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async getOrderById(orderId: number) {
    try {
      return this.orderRepository.findOne({
        where: { id: orderId },
        relations: ['tickets', 'user'],
      });
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }
}
