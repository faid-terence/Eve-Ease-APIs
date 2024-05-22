import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import CreateMessageDto from './DTO/create-message.dto';
import { IsAdminGuard } from 'src/auth/guards/isAdmin.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messageServices: MessagesService) {}

  @Post()
  async userSendMessage(@Body() message: CreateMessageDto) {
    return this.messageServices.userSendMessage(message);
  }

  @UseGuards(IsAdminGuard)
  @Get()
  async getAllMessages() {
    return this.messageServices.getAllMessages();
  }

  @Get(':id')
  async getMessageById(@Param('id') id: number) {
    return this.messageServices.getMessageById(id);
  }

  @Delete(':id')
  async deleteMessage(@Param('id') id: number) {
    return this.messageServices.deleteMessage(id);
  }
}
