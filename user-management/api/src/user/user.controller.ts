import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { UpdatePasswordDto } from '../dtos/update-password.dto';
import { SUCCESS_MESSAGES } from '../constants/messages';
import { BlacklistGuard } from '../auth/blacklist.guard';

@UseGuards(BlacklistGuard)
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    const { password, ...userWithoutPassword } = req.user;
    return userWithoutPassword;
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('profile')
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const userId = req.user.id;
    return this.userService.updateProfile(userId, updateProfileDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('change-password')
  async changePassword(
    @Request() req,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const userId = req.user.id;
    await this.userService.updatePassword(userId, updatePasswordDto);
    return { message: SUCCESS_MESSAGES.PASSWORD_CHANGED }; //
  }
}
