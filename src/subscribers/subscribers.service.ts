import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { subscribe } from 'diagnostics_channel';
import User from 'src/user/Schema/User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectRepository(User) private subscribersRepository: Repository<User>,
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
}
