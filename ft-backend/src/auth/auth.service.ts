import { Injectable,NotFoundException, UnauthorizedException,BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
    private emailService: EmailService
  ) {}

  async signup(email: string, password: string) {
    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) throw new BadRequestException('User already exists');

    const hash = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({ email, password: hash});
    await this.userRepo.save(user);

    // ✅ Send welcome email
    await this.emailService.sendWelcomeEmail(email);

    return { message: 'Signup successful. Welcome email sent!' };
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }

  
  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
  
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
  
    user.resetOtp = {
      code: otp,
      expiresAt: expires,
    };
    await this.userRepo.save(user);
  
    await this.emailService.sendOtpEmail(email, otp);
  
    return { message: 'OTP sent to email' };
  }
  

  // auth.service.ts
  async resetPassword(email: string, otp: string, newPassword: string): Promise<{ message: string }> {
  const user = await this.userRepo.findOne({ where: { email } });
  if (!user || !user.resetOtp || user.resetOtp.code !== otp) {
    throw new BadRequestException('Invalid OTP');
  }

  if (new Date(user.resetOtp.expiresAt) < new Date()) {
    throw new BadRequestException('OTP expired');
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetOtp = null;
  await this.userRepo.save(user);

  return { message: 'Password updated successfully' };
}


}
