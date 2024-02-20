import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import RegisterUserDTO from './Dto/SignUp.dto';
import LoginUserDto from './Dto/Login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authServices: AuthService) {}

  @Post('register')
  async registerUser(@Body() userInformations: RegisterUserDTO) {
    return this.authServices.registerUser(userInformations);
  }

  @Post('login')
  async loginUser(@Body() loginInformation: LoginUserDto) {
    return this.authServices.loginUser(loginInformation);
  }
}
