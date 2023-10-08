import { Controller, Body, Post, Get, Param } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignInCredentials } from './dto/signin-credentials.dto';
import { SignUpCredentials } from './dto/signup-credentials.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('signin')
  async signin(@Body() signInCredentials: SignInCredentials) {
    return this.authenticationService.signIn(signInCredentials);
  }

  @Post('signup')
  async signup(@Body() authSignupDto: SignUpCredentials) {
    return this.authenticationService.signUp(authSignupDto);
  }

  @Get('/confirm/:token')
  async confirmEmail(@Param('token') token: string) {
    return this.authenticationService.confirmEmail(token);
  }
}
