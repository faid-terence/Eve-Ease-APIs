import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/user/Schema/User.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '5m' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, ConfigService, MailService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
