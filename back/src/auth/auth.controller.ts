import { Controller, Post, Body, Req, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';

@Controller('auth')
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @UseInterceptors(FileFieldsInterceptor([])) // <-- Esto permite parsear form-data
  register(@Body() body: any, @Req() req) {
    const data = Object.keys(body || {}).length ? body : req.body;
    return this.authService.register(data);
  }

  @Post('login')
  @Public()
  @UseInterceptors(FileFieldsInterceptor([]))
  login(@Body() body: any, @Req() req) {
    const data = Object.keys(body || {}).length ? body : req.body;
    return this.authService.login(data);
  }

  @Post('forgot-password')
  @Public()
  forgotPassword(@Body() body: any) {
    return this.authService.forgotPassword(body);
  }

  @Post('reset-password')
  @Public()
  resetPassword(@Body() body: any) {
    return this.authService.resetPassword(body);
  }
}
