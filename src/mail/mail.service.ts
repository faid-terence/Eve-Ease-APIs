import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { use } from 'passport';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendUserEmail(user: string, verificationToken: string, email: string) {
    try {
      const appName = this.configService.get<string>('APP_NAME');
      const verificationLink = `http://localhost:3000/auth/verify/${verificationToken}`;

      await this.mailerService.sendMail({
        to: email,
        from: `"${appName} Support Team" <support@example.com>`,
        subject: `${appName} Account Verification`,
        text: `Hi ${user},\n\nWelcome to ${appName}! We're excited to have you on board. To ensure the security of your account and access all the features of our platform, please verify your email address by clicking the link below:\n\n${verificationLink}\n\nThis link will expire in 24 hours, so please verify your email address as soon as possible.\n\nIf you didn't sign up with ${appName} or believe you received this email by mistake, please ignore it. Your account will not be activated until you verify your email.\n\nBest regards,\n${appName} Team`,
        html: `
                    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
                        <div style="background-color: #fff; max-width: 600px; margin: 20px auto; padding: 20px; border-radius: 5px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                            <h2 style="color: #333;">Email Verification</h2>
                            <p style="font-size: 16px; color: #555;">Hi ${user},</p>
                            <p style="font-size: 16px; color: #555;">Welcome to ${appName} We're excited to have you on board. To ensure the security of your account and access all the features of our platform, please verify your email address by clicking the link below:</p>
                            <a href="${verificationLink}" style="background-color: #f9f9f9; display: inline-block; padding: 10px; border-radius: 5px; text-align: center; font-size: 24px; font-weight: bold; color: #2678d0; text-decoration: none;">
                            Email Confirmation Link
                            </a>
                            <p style="font-size: 16px; color: #555;">This link will expire in 24 hours, so please verify your email address as soon as possible.</p>
                            <p style="font-size: 16px; color: #555;">If you didn't sign up with ${appName} or believe you received this email by mistake, please ignore it. Your account will not be activated until you verify your email.</p>
                            <p style="font-size: 16px; color: #555;">Best regards,<br>${appName} Team</p>
                        </div>
                    </body>
                `,
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async sendPasswordResetEmail(
    user: string,
    resetToken: string,
    email: string,
  ) {
    try {
      const appName = this.configService.get<string>('APP_NAME');
      const resetLink = `http://localhost:3000/auth/reset-password/${resetToken}`;

      await this.mailerService.sendMail({
        to: email,
        from: `"${appName} Support Team" <support@example.com>`,
        subject: `${appName} Password Reset`,
        text: `Hi ${user},\n\nYou recently requested to reset your password for ${appName}. Please click the link below to reset it:\n\n${resetLink}\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\n${appName} Team`,
        html: `
                    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
                        <div style="background-color: #fff; max-width: 600px; margin: 20px auto; padding: 20px; border-radius: 5px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                            <h2 style="color: #333;">Password Reset</h2>
                            <p style="font-size: 16px; color: #555;">Hi ${user},</p>
                            <p style="font-size: 16px; color: #555;">You recently requested to reset your password for ${appName}. Please click the link below to reset it:</p>
                            <a href="${resetLink}" style="background-color: #f9f9f9; display: inline-block; padding: 10px; border-radius: 5px; text-align: center; font-size: 24px; font-weight: bold; color: #2678d0; text-decoration: none;">
                            Reset Password
                            </a>
                            <p style="font-size: 16px; color: #555;">If you didn't request this, please ignore this email.</p>
                            <p style="font-size: 16px; color: #555;">Best regards,<br>${appName} Team</p>
                        </div>
                    </body>
                `,
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  // send email to subscribers when a new post is created
  async sendNewPostEmail(subscribers: string[], event: string) {
    try {
      const appName = this.configService.get<string>('APP_NAME');
      const eventLink = `http://localhost:3000/posts/${event}`;

      await this.mailerService.sendMail({
        to: subscribers,
        from: `"${appName} Support Team" <support@yourdomain.com>`,
        subject: 'New Post Notification',
        html: `<p>Hello,</p><p>A new post is available on ${appName}!</p><p>Visit the post <a href="${eventLink}">here</a>.</p><p>Thank you!</p>`,
      });

      console.log('New post email notification sent successfully.');
    } catch (error) {
      console.error('Error sending new post email notification:', error);
      // Handle error
    }
  }
}
