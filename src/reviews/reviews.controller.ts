import { Body, Controller, Post } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import Review from './Schema/Review.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async createReview(
    @Body() review: Review,
    @Body('userId') userId: number,
    @Body('eventId') eventId: number,
  ) {
    return await this.reviewsService.createReview(review, userId, eventId);
  }
}
