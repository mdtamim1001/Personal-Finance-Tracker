import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // use TLS
      auth: {
        user: 'tamimyousuf2001@gmail.com',     // 👈 replace
        pass: 'iqvr frgb ocfc ubbe'    // 👈 replace with App Password (not your real Gmail password)
      }
    });
  }

  async sendWelcomeEmail(to: string, name?: string) {
    const info = await this.transporter.sendMail({
      from: '"Personal Finance Tracker" <tamimyousuf2001@gmail.com>',
      to,
      subject: 'Welcome to Personal Finance Tracker',
      html: `<h2>Welcome${name ? ', ' + name : ''}!</h2>
             <p>Your account was successfully created.</p>
             <p>Start tracking your finances smartly ✨</p>`
    });

    console.log('Email sent: ', info.messageId);
  }

  async sendOtpEmail(to: string, otp: string) {
    await this.transporter.sendMail({
      from: '"Finance Tracker" <tamimyousuf2001@gmail.com>',
      to,
      subject: 'Password Reset OTP',
      html: `<h2>Reset Your Password</h2>
             <p>Your OTP is: <strong>${otp}</strong></p>
             <p>This code expires in 10 minutes.</p>`
    });
  }
}
