import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
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
import { v4 as uuidv4 } from 'uuid';
import { randomBytes } from 'crypto';
import { MailService } from 'src/mail/mail.service';
import { use } from 'passport';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtServices: JwtService,
    private mailerServices: MailService,
  ) {}

  async registerUser(registerDto: RegisterUserDTO): Promise<User> {
    const { email, phoneNumber, password } = registerDto;

    if ((!email && !phoneNumber) || !password) {
      throw new BadRequestException('Password is required');
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
      const verificationToken = uuidv4();

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

      const savedUser = await this.userRepository.save(newUser);

      return savedUser;
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

    if (!existUser.isVerified) {
      throw new UnauthorizedException('Please verify your email');
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

  async verifyUserToken(token: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { verificationToken: token },
    });
    if (!user) {
      throw new NotFoundException('Invalid verification token');
    }
    user.isVerified = true;

    await this.userRepository.save(user);

    return {
      message: 'Email Verification Successful',
    };
  }
}
