import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/user/Schema/User.entity';
import RegisterUserDTO from './Dto/SignUp.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async registerUser(registerDto: RegisterUserDTO): Promise<User> {
    const { email, phoneNumber } = registerDto;
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

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    registerDto.password = hashedPassword;

    const newUser = this.userRepository.create(registerDto);
    return await this.userRepository.save(newUser);
  }
}
