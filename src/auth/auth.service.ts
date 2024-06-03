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
import { v4 as uuidv4 } from 'uuid';
import { randomBytes } from 'crypto';
import { MailService } from 'src/mail/mail.service';
import { MoreThan } from 'typeorm';

@Injectable()
export class AuthService {
  [x: string]: any;
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

      await this.userRepository.save(newUser);

      return {
        message:
          'Thank you for registering with us. An email containing a verification link has been sent to your registered email address. Please check your inbox to complete the registration process.',
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async loginUser(
    loginDto: LoginUserDto,
  ): Promise<{ message: string; token?: string }> {
    const { email, phoneNumber, password } = loginDto;
    if ((!phoneNumber && !email) || !password) {
      throw new NotAcceptableException('Invalid Inputs');
    }
    const existUser = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email OR user.phoneNumber = :phoneNumber', {
        email,
        phoneNumber,
      })
      .getOne();

    if (!existUser) {
      throw new UnauthorizedException('Invalid Credentials');
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
      isAdmin: existUser.isAdmin,
      email: existUser.email,
    });

    return {
      message: 'Login successful!',
      token: userToken,
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

  validateToken(token: string) {
    return this.jwtServices.verify(token, {
      secret: process.env.JWT_SECRET_KEY,
    });
  }

  async sendPasswordResetEmail(email: string): Promise<{ message: string }> {
    try {
      const user = await this.userRepository.findOneBy({ email });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const resetToken = await this.generateVerificationToken(20);
      user.resetToken = resetToken;
      user.resetTokenExpires = new Date(Date.now() + 3600000);
      await this.userRepository.save(user);

      await this.mailerServices.sendPasswordResetEmail(
        user.fullNames,
        resetToken,
        user.email,
      );

      return {
        message: 'Password reset link has been sent to your email',
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async resetPassword(
    resetToken: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          resetToken,
          resetTokenExpires: MoreThan(new Date(Date.now())),
        },
      });

      if (!user) {
        throw new NotFoundException('Invalid or expired reset token');
      }

      // Ensure newPassword is not empty
      if (!newPassword) {
        throw new BadRequestException('New password cannot be empty');
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update user's password, resetToken, and resetTokenExpires
      user.password = hashedPassword;
      user.resetToken = null;
      user.resetTokenExpires = null;

      // Save the updated user
      await this.userRepository.save(user);

      // Return a success message
      return {
        message: 'Password reset successful',
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async makeAdmin(userId: number): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.isAdmin = true;
    await this.userRepository.save(user);
    return {
      message: 'User is now an admin',
    };
  }
}
