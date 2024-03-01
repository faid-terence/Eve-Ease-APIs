import { Body, Controller, Get, Post } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';

@Controller('subscribe')
export class SubscribersController {
  constructor(private subscribersService: SubscribersService) {}

  @Post()
  async subscribeUser(@Body('email') email: string) {
    return this.subscribersService.subscribeUser(email);
  }

  @Post('unsubscribe')
  async unsubscribeUser(@Body('email') email: string) {
    return this.subscribersService.unsubscribeUser(email);
  }

  @Get('all')
  async getAllSubscribers() {
    return this.subscribersService.getAllSubscribers();
  }
}
