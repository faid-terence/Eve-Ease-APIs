import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/user/Schema/User.entity';
import RegisterUserDTO from './Dto/SignUp.dto';
import * as bcrypt from 'bcrypt';
import LoginUserDto from './Dto/Login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtServices: JwtService,
  ) {}

  async registerUser(registerDto: RegisterUserDTO): Promise<User> {
    const { email, phoneNumber, password } = registerDto;
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      fullNames: registerDto.fullNames,
      email,
      country: registerDto.country,
      phoneNumber,
      password: hashedPassword,
      profilePhoto: registerDto.profilePhoto,
    });
    return await this.userRepository.save(newUser);
  }

  async loginUser(
    loginDto: LoginUserDto,
  ): Promise<{ message: string; token?: string }> {
    const { email, phoneNumber, password } = loginDto;
    if ((!phoneNumber && !email) || !password) {
      throw new BadRequestException('Invalid Inputs');
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
      throw new BadRequestException('Invalid Credentials');
    }

    const userToken = this.jwtServices.sign({
      id: existUser.id,
      name: existUser.fullNames,
    });

    return {
      message: "Login successful!",
      token: userToken
    }
  }
}
