import { Module } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { SubscribersController } from './subscribers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/user/Schema/User.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [SubscribersService],
  controllers: [SubscribersController]
})
export class SubscribersModule {}
