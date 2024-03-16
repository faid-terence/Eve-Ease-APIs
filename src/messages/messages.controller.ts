import { Controller, Post, Body } from '@nestjs/common';
import { MessagesService } from './messages.service';
import CreateMessageDto from './DTO/create-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messageServices: MessagesService) {}

  @Post()
  async userSendMessage(@Body() message: CreateMessageDto) {
    return this.messageServices.userSendMessage(message);
  }
}
