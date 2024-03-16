import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { MessagesService } from './messages.service';
import CreateMessageDto from './DTO/create-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messageServices: MessagesService) {}

  @Post()
  async userSendMessage(@Body() message: CreateMessageDto) {
    return this.messageServices.userSendMessage(message);
  }

  @Get()
  async getAllMessages() {
    return this.messageServices.getAllMessages();
  }

  @Get(':id')
  async getMessageById(@Param('id') id: number) {
    return this.messageServices.getMessageById(id);
  }
}
