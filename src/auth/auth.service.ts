import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { Jwt, Msg } from './interfaces/auth.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signUp(dto: AuthDto): Promise<Msg> {
    const hashed = await bcrypt.hash(dto.password, 12);
    try {
      await this.prisma.user.create({
        data: {
          email: dto.email,
          hashedPassword: hashed,
        },
      });
      return { message: 'ok' };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return { message: 'This email is already taken' };
        }
      }

      throw error;
    }
  }

  async login(dto: AuthDto): Promise<Jwt> {
    // なぜか then が必要
    const user = await this.prisma.user
      .findUnique({
        where: {
          email: dto.email,
        },
      })
      .then((user) => user);

    if (!user) throw new ForbiddenException('Email or password is incorrect');
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.hashedPassword,
    );
    if (!isPasswordValid)
      throw new ForbiddenException('Email or password is incorrect');

    return this.generateJwt(user.id, user.email);
  }

  async generateJwt(userid: number, email: string): Promise<Jwt> {
    const payload = { sub: userid, email: email };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '5m',
      secret: secret,
    });

    return { accessToken: token };
  }
}
