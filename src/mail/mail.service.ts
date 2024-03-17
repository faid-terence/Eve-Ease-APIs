import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { use } from 'passport';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as pdfkit from 'pdfkit';
import * as PDFDocument from 'pdfkit';

interface TicketData {
  eventName: string;
  name: string;
  seat: string;
  date: string;
  time: string;
  price: string;
  barcode: string;
}
import User from 'src/user/Schema/User.entity';
@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendUserEmail(user: string, verificationToken: string, email: string) {
    try {
      const appName = this.configService.get<string>('APP_NAME');
      const verificationLink = `http://localhost:5173/auth/email-verified/${verificationToken}`;

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
      const resetLink = `http://localhost:5173/auth/set-new-password/${resetToken}`;

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
  async sendNewPostEmail(email: string, eventId: number) {
    try {
      const appName = this.configService.get<string>('APP_NAME');
      const eventLink = `http://localhost:3000/event/${eventId}`;

      await this.mailerService.sendMail({
        to: email,
        from: `"${appName} Support Team" <support@yourdomain.com>`,
        subject: 'New Post Notification',
        html: `<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="background-color: #fff; max-width: 600px; margin: 20px auto; padding: 20px; border-radius: 5px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333;">New Event Notification</h2>
            <p style="font-size: 16px; color: #555;">Hi ${email},</p>
            <p style="font-size: 16px; color: #555;">A new event has been created on ${appName}. Click the button below to view the details:</p>
            <a href="${eventLink}" style="background-color: #2678d0; display: inline-block; padding: 10px; border-radius: 5px; text-align: center; font-size: 24px; font-weight: bold; color: #fff; text-decoration: none;">
                View Event
            </a>
            <p style="font-size: 16px; color: #555;">Stay tuned for more updates!</p>
            <p style="font-size: 16px; color: #555;">Best regards,<br>${appName} Team</p>
        </div>
    </body>`,
      });

      console.log('New post email notification sent successfully.');
    } catch (error) {
      console.error('Error sending new post email notification:', error);
    }
  }

  async sendTicketEmail(email: string, ticketData: TicketData) {
    try {
      const appName = this.configService.get<string>('APP_NAME');

      // Generate PDF content
      const pdfPath = await this.generateTicketPDF(ticketData);

      // Send email with PDF attachment
      await this.mailerService.sendMail({
        to: email,
        from: `"${appName} Support Team" <support@yourdomain.com>`,
        subject: 'New Ticket Notification',
        html: `<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
                <div style="background-color: #fff; max-width: 600px; margin: 20px auto; padding: 20px; border-radius: 5px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                    <h2 style="color: #333;">New Event Notification</h2>
                    <p style="font-size: 16px; color: #555;">Hi ${email},</p>
                    <p style="font-size: 16px; color: #555;">Your ticket details are below:</p>
                    <a href="${pdfPath}" style="background-color: #2678d0; display: inline-block; padding: 10px; border-radius: 5px; text-align: center; font-size: 24px; font-weight: bold; color: #fff; text-decoration: none;">
                        View Ticket
                    </a>
                    <p style="font-size: 16px; color: #555;">Stay tuned for more updates!</p>
                    <p style="font-size: 16px; color: #555;">Best regards,<br>${appName} Team</p>
                </div>
            </body>`,
        attachments: [
          {
            filename: `ticket_${ticketData.eventName.replace(/\s+/g, '_').toLowerCase()}.pdf`,
            path: pdfPath,
          },
        ],
      });
    } catch (error) {
      console.error('Error sending ticket email:', error);
    }
  }

  // async generateTicketPDF(ticketData: TicketData): Promise<string> {
  //   return new Promise<string>((resolve, reject) => {
  //     try {
  //       // Create a new PDF document
  //       const doc = new pdfkit();
  //       const pdfPath = path.join(
  //         __dirname,
  //         `ticket_${ticketData.eventName.replace(/\s+/g, '_').toLowerCase()}.pdf`,
  //       );

  //       // Pipe the PDF content to a file
  //       doc.pipe(fs.createWriteStream(pdfPath));

  //       // Add content to the PDF (customize as per your requirements)
  //       doc.text(`Event Name: ${ticketData.eventName}`);
  //       doc.text(`Ticket Holder Name: ${ticketData.name}`);
  //       doc.text(`Seat: ${ticketData.seat}`);
  //       doc.text(`Date: ${ticketData.date}`);
  //       doc.text(`Time: ${ticketData.time}`);
  //       doc.text(`Price: ${ticketData.price}`);
  //       // Add more ticket details as needed

  //       // Finalize the PDF
  //       doc.end();

  //       resolve(pdfPath);
  //     } catch (error) {
  //       reject(error);
  //     }
  //   });
  // }

  async sendTicketToUser(user: User, ticketData: TicketData): Promise<void> {
    try {
      const appName = this.configService.get<string>('APP_NAME');
      const pdfPath = await this.generateTicketPDF(ticketData);

      await this.mailerService.sendMail({
        to: user.email,
        from: `"${appName} Support Team" <support@yourdomain.com>`,
        subject: 'Ticket Notification',
        html: this.generateTicketEmail(
          appName,
          user.name,
          pdfPath,
          ticketData.eventName,
        ),
        attachments: [
          {
            filename: `ticket_${ticketData.eventName.replace(/\s+/g, '_').toLowerCase()}.pdf`,
            path: pdfPath,
          },
        ],
      });
    } catch (error) {
      console.error('Error sending ticket email:', error);
    }
  }

  private generateTicketEmail(
    appName: string,
    userName: string,
    pdfPath: string,
    eventName: string,
  ): string {
    return `
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="background-color: #fff; max-width: 600px; margin: 20px auto; padding: 20px; border-radius: 5px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333;">Ticket Notification</h2>
          <p style="font-size: 16px; color: #555;">Hi ${userName},</p>
          <p style="font-size: 16px; color: #555;">Your ticket details are below:</p>
          <a href="${pdfPath}" style="background-color: #2678d0; display: inline-block; padding: 10px; border-radius: 5px; text-align: center; font-size: 24px; font-weight: bold; color: #fff; text-decoration: none;">
            View Ticket
          </a>
          <p style="font-size: 16px; color: #555;">Stay tuned for more updates!</p>
          <p style="font-size: 16px; color: #555;">Best regards,<br>${appName} Team</p>
        </div>
      </body>
    `;
  }

  private async generateTicketPDF(ticketData: TicketData): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const pdfPath = `./tickets/ticket_${ticketData.eventName.replace(/\s+/g, '_').toLowerCase()}.pdf`;
      const doc = new PDFDocument();

      doc.pipe(fs.createWriteStream(pdfPath));
      doc.fontSize(16).text(`Event: ${ticketData.eventName}`);
      doc.fontSize(14).text(`Date: ${ticketData.date}`);
      doc.end();

      doc.on('finish', () => {
        resolve(pdfPath);
      });

      doc.on('error', (error) => {
        reject(error);
      });
    });
  }
}
