import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Review from './Schema/Review.entity';
import User from 'src/user/Schema/User.entity';
import Event from 'src/events/Schema/Event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, User, Event])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
