import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Msg } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: AuthDto): Promise<Msg> {
    return this.authService.signUp(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Msg> {
    const jwt = await this.authService.login(dto);
    res.cookie('access_token', jwt.accessToken, {
      httpOnly: true,
      secure: false, // 後ほど修正
      sameSite: 'none',
      path: '/',
    });

    return { message: 'ok' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Msg {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: false, // 後ほど修正
      sameSite: 'none',
      path: '/',
    });

    return { message: 'ok' };
  }
}
