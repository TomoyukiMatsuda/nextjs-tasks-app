import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(AuthGuard('jwt')) // IDEA 上エラーになるものの terminal で npm run start:dev してもエラーは消える
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // TODO: npm run start:dev 時にエラーが出るため、キャストしている

  @Get()
  getLoginUser(@Req() req: Request): Omit<User, 'hashedPassword'> {
    return req.user as Omit<User, 'hashedPassword'>;
  }

  @Patch()
  updateUser(
    @Req() req: Request,
    @Body() dto: UpdateUserDto,
  ): Promise<Omit<User, 'hashedPassword'>> {
    return this.userService.updateUser((req.user as User).id, dto);
  }
}
