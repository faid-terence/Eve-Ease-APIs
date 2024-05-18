import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Review from './Schema/Review.entity';
import { Repository } from 'typeorm';
import User from 'src/user/Schema/User.entity';
import Event from 'src/events/Schema/Event.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async createReview(
    review: Review,
    userId: number,
    eventId: number,
  ): Promise<Review> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new Error('User not found');
      }
      const event = await this.eventRepository.findOne({
        where: { id: eventId },
      });
      if (!event) {
        throw new Error('Event not found');
      }
      review.reviewer = user;
      review.event = event;
      const savedReview = await this.reviewRepository.save(review);

      return savedReview;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getReviewsByEventId(eventId: number): Promise<Review[]> {
    try {
      const reviews = await this.reviewRepository.find({
        where: { event: { id: eventId } },
        relations: ['reviewer'],
      });
      if (!reviews) {
        throw new Error('No reviews found');
      }
      return reviews;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAllReviews(): Promise<Review[]> {
    try {
      const reviews = await this.reviewRepository.find();
      return reviews;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
