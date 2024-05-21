import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import UpdateUserDTO from './DTO/UpdateUser.dto';
import { ApiTags } from '@nestjs/swagger';
import { IsAdminGuard } from 'src/auth/guards/isAdmin.guard';

@ApiTags('User Management')
@Controller('user')
export class UserController {
  constructor(private userServices: UserService) {}

  @Get('/')
  @UseGuards(IsAdminGuard)
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

  @Post('/upload-verification-doc')
  async uploadverifivationDoc(
    @Body('userEmail') email: string,
    @Body('verificationDoc') verificationDoc: string,
  ) {
    return this.userServices.userUploadDocumentForVerification(
      email,
      verificationDoc,
    );
  }

  @Post('/appove-user-doc')
  @UseGuards(IsAdminGuard)  
  async approveUserDoc(@Body('userEmail') email: string) {
    return this.userServices.approveUserDocument(email);
  }

  @Post('/reject-user-doc')
  @UseGuards(IsAdminGuard)
  async rejectUserDoc(@Body('userEmail') email: string) {
    return this.userServices.adminRejectionOfDocument(email);
  }
}
