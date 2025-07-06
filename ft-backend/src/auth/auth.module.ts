import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserSchema } from './user.entity'; // Import the User schema
import { User } from './user.entity'; // Import the User interface
import { EmailService } from '../email/email.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController], // ✅ controllers go here
  providers: [AuthService, EmailService, JwtStrategy], // ✅ services/providers go here
  exports: [AuthService], // ✅ only export services used in other modules
})
export class AuthModule {}
