import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Messages from './schema/messages.entity';
import { Repository } from 'typeorm';
import CreateMessageDto from './DTO/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Messages)
    private messagesRepository: Repository<Messages>,
  ) {}

  async userSendMessage(message: CreateMessageDto) {
    try {
      const newMessage = await this.messagesRepository.create(message);
      await this.messagesRepository.save(newMessage);
      return {
        message: 'Message sent successfully!',
        newMessage,
      };
    } catch (error) {
      throw new Error(`Error: ${error.message}`);
    }
  }

  async getAllMessages() {
    try {
      return await this.messagesRepository.find();
    } catch (error) {
      throw new Error(`Error: ${error.message}`);
    }
  }

  async getMessageById(id: number) {
    try {
      const message = await this.messagesRepository.findOne({ where: { id } });

      if (!message) {
        throw new NotFoundException('Message not found!');
      }

      return message;
    } catch (error) {
      throw error;
    }
  }

  async deleteMessage(id: number) {
    try {
      const deleteResult = await this.messagesRepository.delete({ id });

      if (deleteResult.affected === 0) {
        throw new NotFoundException('Message not found!');
      }

      return deleteResult;
    } catch (error) {
      throw new Error(`Failed to delete message: ${error.message}`);
    }
  }
}
