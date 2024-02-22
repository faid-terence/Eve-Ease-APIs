import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userServices: UserService) {}

  @Get('/')
  async getAllUsers() {
    return this.userServices.getAllUsers();
  }
}
