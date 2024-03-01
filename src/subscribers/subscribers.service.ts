import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { subscribe } from 'diagnostics_channel';
import Event from 'src/events/Schema/Event.entity';
import { MailService } from 'src/mail/mail.service';
import User from 'src/user/Schema/User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectRepository(User) private subscribersRepository: Repository<User>,
    @InjectRepository(Event) private eventRepository: Repository<Event>,
    private mailerServices: MailService,
  ) {}

  async subscribeUser(email: string): Promise<{ message: string }> {
    try {
      const user = await this.subscribersRepository.findOne({
        where: { email },
      });
      if (!user) {
        return { message: 'User not found' };
      }
      user.isSubscribed = true;
      await this.subscribersRepository.save(user);
      return { message: 'User subscribed successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async unsubscribeUser(email: string): Promise<{ message: string }> {
    try {
      const user = await this.subscribersRepository.findOne({
        where: { email },
      });
      if (!user) {
        return { message: 'User not found' };
      }
      user.isSubscribed = false;
      await this.subscribersRepository.save(user);
      return { message: 'User unsubscribed successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAllSubscribers(): Promise<User[]> {
    try {
      const subscribers = await this.subscribersRepository.find({
        where: { isSubscribed: true },
      });
      return subscribers;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async sendNotificationToSubscribers(
    eventId: number,
  ): Promise<{ message: string }> {
    try {
      const event = await this.eventRepository.findOne({
        where: { id: eventId },
      });

      if (!event) {
        return { message: 'Event not found' };
      }
      const subscribers = await this.subscribersRepository.find({
        where: { isSubscribed: true },
      });
      subscribers.forEach(async (subscriber) => {
        await this.mailerServices.sendNewPostEmail(subscriber.email, event.id);
      });
      return { message: 'Notification sent successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
