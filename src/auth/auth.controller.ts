import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import RegisterUserDTO from './Dto/SignUp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authServices: AuthService) {}

  @Post('register')
  async registerUser(@Body() userInformations: RegisterUserDTO) {
    return this.authServices.registerUser(userInformations);
  }
}
