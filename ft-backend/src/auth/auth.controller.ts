import { Body, Controller, Post, Get, UseGuards  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto } from './dto/auth.dto';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @UsePipes(new ValidationPipe())
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto.email, signupDto.password);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyAccount(@GetUser() user) {
    return {
      id: user.sub,
      email: user.email
    };
  }
  
  // auth.controller.ts
  @Post('forgot-password')
  forgotPassword(@Body('email') email: string) {
  return this.authService.forgotPassword(email);
  }

  // auth.controller.ts
  @Post('reset-password')
  resetPassword(
  @Body('email') email: string,
  @Body('otp') otp: string,
  @Body('newPassword') newPassword: string
) {
  return this.authService.resetPassword(email, otp, newPassword);
}




  
}




