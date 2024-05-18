import { Body, Controller, Get, Post } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import Review from './Schema/Review.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('reviews')
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

  @Get('event')
  async getReviewsByEventId(@Body('eventId') eventId: number) {
    return await this.reviewsService.getReviewsByEventId(eventId);
  }

  @Get()
  async getAllReviews() {
    return await this.reviewsService.getAllReviews();
  }
}
