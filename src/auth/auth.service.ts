import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/user/Schema/User.entity';
import RegisterUserDTO from './Dto/SignUp.dto';
import * as bcrypt from 'bcrypt';
import LoginUserDto from './Dto/Login.dto';
import { JwtService } from '@nestjs/jwt';
import LoginResponseDto from './Dto/LoginResponse.dto';

import { randomBytes } from 'crypto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtServices: JwtService,
    private mailerServices: MailService,
  ) {}

  async registerUser(
    registerDto: RegisterUserDTO,
  ): Promise<{ message: string }> {
    const { email, phoneNumber, password } = registerDto;
    if ((!email && !phoneNumber) || !password) {
      throw new BadRequestException('Invalid inputs');
    }

    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email OR user.phoneNumber = :phoneNumber', {
        email,
        phoneNumber,
      })
      .getOne();

    if (user) {
      throw new ConflictException(
        `User with email ${email} or phone number ${phoneNumber} already exists`,
      );
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationToken = await this.generateVerificationToken(10);

      const newUser = this.userRepository.create({
        fullNames: registerDto.fullNames,
        email,
        country: registerDto.country,
        phoneNumber,
        password: hashedPassword,
        profilePhoto: registerDto.profilePhoto,
        verificationToken: verificationToken,
      });

      await this.mailerServices.sendUserEmail(
        registerDto.fullNames,
        verificationToken,
        registerDto.email,
      );

      return {
        message: `Thank you for registering with us. An email containing a verification link has been sent to ${email}! . Please check your inbox to complete the registration process`,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async loginUser(
    loginDto: LoginUserDto,
  ): Promise<{ message: string; token?: string; data?: LoginResponseDto }> {
    const { email, phoneNumber, password } = loginDto;
    if ((!phoneNumber && !email) || !password) {
      throw new NotAcceptableException('Invalid Inputs');
    }
    let existUser;

    if (email) {
      existUser = await this.userRepository.findOneBy({ email });
    }
    if (phoneNumber) {
      existUser = await this.userRepository.findOneBy({ phoneNumber });
    }
    const passwordMatch = await bcrypt.compare(password, existUser.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const userToken = this.jwtServices.sign({
      id: existUser.id,
      name: existUser.fullNames,
      photo: existUser.profilePhoto,
    });

    return {
      message: 'Login successful!',
      token: userToken,
      data: {
        fullNames: existUser.fullNames,
        profilePhoto: existUser.profilePhoto,
      },
    };
  }

  async generateVerificationToken(length: number): Promise<string> {
    return randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }
}
