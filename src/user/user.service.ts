import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './Schema/User.entity';
import { Repository } from 'typeorm';
import UpdateUserDTO from './DTO/UpdateUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    try {
      const users = await this.userRepository.find();
      if (users.length == 0) {
        throw new NotFoundException('No User found in Databse');
      }
      return users;
    } catch (error) {}
  }

  async getUserById(userId: number): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} does not exist`);
      }
      return user;
    } catch (error) {}
  }

  async updateUserProfile(userId: number, updateUserInfo: UpdateUserDTO) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} does not exist`);
    }
    if (updateUserInfo.fullNames) {
      user.fullNames = updateUserInfo.fullNames;
    }
    if (updateUserInfo.email) {
      user.email = updateUserInfo.email;
    }
    if (updateUserInfo.country) {
      user.country = updateUserInfo.country;
    }

    if (updateUserInfo.phoneNumber) {
      user.phoneNumber = updateUserInfo.phoneNumber;
    }
    if (updateUserInfo.profilePhoto) {
      user.profilePhoto = updateUserInfo.profilePhoto;
    }
    if (updateUserInfo.password) {
      const hashedPassword = await bcrypt.hash(updateUserInfo.password, 10);
      user.password = hashedPassword;
    }

    const updatedUser = await this.userRepository.save(user);

    return {
      message: 'User Updated Successful',
      updatedUser,
    };
  }
}
