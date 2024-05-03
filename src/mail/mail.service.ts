import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { TicketsService } from 'src/tickets/tickets.service';
import * as fs from 'fs';
import * as path from 'path';
import * as PDFDocument from 'pdfkit';
import * as wkhtmltopdf from 'wkhtmltopdf-installer';
import * as puppeteer from 'puppeteer';
import * as qrcode from 'qrcode';

import User from 'src/user/Schema/User.entity';
@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
    // private ticketsService: TicketsService,
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

  async sendTicketEmail(email: string, ticketData: any) {
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

  async sendTicketToUser(user: User, ticketData: any): Promise<void> {
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

  async generateTicketPDF(eventName: string): Promise<string> {
    const directory = './tickets/';
    const pdfPath = path.join(
      directory,
      `ticket_${eventName.replace(/\s+/g, '_').toLowerCase()}.pdf`,
    );
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);
    doc.fontSize(16).text(`Event: ${eventName}`);
    doc.fontSize(14).text('Date:');
    doc.end();

    return new Promise<string>((resolve, reject) => {
      writeStream.on('finish', () => {
        resolve(pdfPath);
      });

      writeStream.on('error', (err) => {
        reject(err);
      });
    });
  }

  async sendTicketByEmail(email: string, pdfPath: string) {
    const mailOptions = {
      to: email,
      subject: 'Your Ticket is Ready!',
      text: 'Please find your ticket attached.',
      attachments: [
        {
          filename: 'ticket.pdf',
          path: pdfPath,
        },
      ],
    };

    await this.mailerService.sendMail(mailOptions);
  }

  async sendTicketPdf(userEmail: string, ticketHtml: string) {
    try {
      const pdfBuffer = await this.generatePdfFromHtml(ticketHtml);

      await this.mailerService.sendMail({
        to: userEmail,
        subject: 'Your Event Ticket',
        text: 'Please find your event ticket attached.',
        attachments: [
          {
            filename: 'ticket.pdf',
            content: pdfBuffer,
          },
        ],
      });

      console.log(`Ticket PDF sent to ${userEmail}`);
    } catch (error) {
      console.error('Error sending ticket PDF:', error);
    }
  }

  private generatePdfFromHtml(html: string): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const wkhtmltopdfBinary = wkhtmltopdf('bin/wkhtmltopdf');

      wkhtmltopdf
        .create(wkhtmltopdfBinary)
        .fromString(html, {
          encoding: 'utf-8',
          lowQuality: true,
        })
        .toBuffer((err, buffer) => {
          if (err) {
            reject(err);
          } else {
            resolve(buffer);
          }
        });
    });
  }

  async sendTicketPdfAfterPayment(
    userEmail: string,
    ticketId: number,
    eventDetails,
  ) {
    const appName = this.configService.get<string>('APP_NAME');
    try {
      // Generate a random string for QR code
      // const randomString = Math.random().toString(36).substring(2, 15);

      const verificationLink = `http://localhost:3000/tickets/verify-ticket/${ticketId}`;

      // Create a QR code image buffer
      const qrCodeBuffer = await qrcode.toBuffer(verificationLink, {
        type: 'png',
      });

      const randomTicketNumber = Math.floor(Math.random() * 1000000000);

      // Create a base64 string from the buffer
      const qrCodeBase64 = qrCodeBuffer.toString('base64');

      const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Event Tickets</title>
          <style>
            @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap");
            html, body {
              height: 100%;
              margin: 0;
              padding: 0;
            }
            body {
              font-family: "Montserrat", sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .ticket-container {
              perspective: 1000px;
            }
            .ticket {
              background: linear-gradient(135deg, #47a847, #2e8b2e);
              color: #fff;
              width: 300px;
              height: 500px;
              border-radius: 20px;
              box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;
              padding: 20px;
              position: relative;
              transform-style: preserve-3d;
              transition: transform 0.5s;
            }
            .ticket:hover {
              transform: rotateY(20deg);
            }
            .event-info {
              text-align: center;
            }
            .event-info h2 {
              font-size: 24px;
              margin-bottom: 10px;
            }
            .qr-code {
              width: 120px;
              height: 120px;
              background-color: #fff;
              border-radius: 10px;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .qr-code img {
              max-width: 100%;
              max-height: 100%;
            }
            .ticket-details {
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="ticket-container">
            <div class="ticket">
              <div class="event-info">
                <h2>${eventDetails.Event_Name}</h2>
                <p>${eventDetails.Event_Venue}</p>
                <p>${eventDetails.Event_Date}</p>
              </div>
              <div class="qr-code">
                <img src="data:image/png;base64,${qrCodeBase64}" alt="QR Code" />
              </div>
              <div class="ticket-details">
                <p>Ticket No: ${randomTicketNumber}</p>
                <p>Seat: A12</p>
              </div>
            </div>
          </div>
        </body>
      </html>`;

      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      const pdfBuffer = await page.pdf({
        printBackground: true,
      });
      await browser.close();

      await this.mailerService.sendMail({
        to: userEmail,
        from: `"${appName} Support Team" <support@yourdomain.com>`,
        subject: 'Your Event Ticket',
        attachments: [
          {
            filename: 'ticknet_ticket.pdf',
            content: pdfBuffer,
          },
        ],
      });

      console.log(`Ticket PDF sent to ${userEmail}`);
    } catch (error) {
      console.error('Error sending ticket PDF:', error);
    }
  }

  async sendTicketCreationGuide(userEmail: string, user: string) {
    try {
      const appName = this.configService.get<string>('APP_NAME');

      await this.mailerService.sendMail({
        to: userEmail,
        from: `"${appName} Support Team" <support@example.com>`,
        subject: `${appName} Ticket Creation Guide`,
        text: `Hi ${user},\n\nWelcome to ${appName}! We're glad you're here. If you need assistance or want to report an issue, creating a support ticket is easy. Just follow these steps:\n\n1. Log in to your ${appName} account.\n2. Navigate to the dashboard.\n3. click the ticket icon in the action field.\n4. Choose "Create a New Ticket" option.\n5. Fill in the required details,\n\nIf you have any questions or encounter any difficulties, feel free to reach out to us at faidterence@outlook.com.\n\nBest regards,\n${appName} Team`,
        html: `
            <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
                <div style="background-color: #fff; max-width: 600px; margin: 20px auto; padding: 20px; border-radius: 5px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                    <h2 style="color: #333;">${appName} Ticket Creation Guide</h2>
                    <p style="font-size: 16px; color: #555;">Hi ${user},</p>
                    <p style="font-size: 16px; color: #555;">Welcome to ${appName}! We're glad you're here. If you need assistance or want to report an issue, creating a support ticket is easy. Just follow these steps:</p>
                    <ol style="font-size: 16px; color: #555; padding-left: 20px;">
                        <li>Log in to your ${appName} account.</li>
                        <li>Navigate to the dashboard.</li>
                        <li>Click the green icon in the event table.</li>
                        <li>Choose "Create a New Ticket" option.</li>
                        <li>Fill in the required details</li>
                        <li>Submit the ticket.</li>
                    </ol>
                    <p style="font-size: 16px; color: #555;">If you have any questions or encounter any difficulties, feel free to reach out to us at <a href="mailto:faidterence@outlook.com">Terence Faid JABO</a>.</p>
                    <p style="font-size: 16px; color: #555;">Best regards,<br>${appName} Team</p>
                </div>
            </body>
        `,
      });
    } catch (error) {}
  }
}
