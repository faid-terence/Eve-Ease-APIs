import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userServices: UserService) {}

  @Get('/')
  async getAllUsers() {
    return this.userServices.getAllUsers();
  }

  @Get('/:userId')
  async getUserById(@Param('userId') userId: number) {
    return this.userServices.getUserById(userId);
  }
}
