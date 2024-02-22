import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import UpdateUserDTO from './DTO/UpdateUser.dto';

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

  @Patch('/:userId')
  async updateUserInfo(
    @Param('userId') userId: number,
    @Body() userInformation: UpdateUserDTO,
  ) {
    return this.userServices.updateUserProfile(userId, userInformation);
  }

  @Delete('/:userId')
  async deleteUserById(@Param('userId') userId: number) {
    return this.userServices.deleteUser(userId);
  }
}
