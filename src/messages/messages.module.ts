import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Messages from './schema/messages.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Messages]), AuthModule],
  providers: [MessagesService],
  controllers: [MessagesController],
})
export class MessagesModule {}
