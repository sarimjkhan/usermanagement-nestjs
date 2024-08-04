import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginUserDto } from 'src/dtos/login-user.dto';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ERROR_MESSAGES } from '../constants/messages';

interface JwtPayload {
  username: string;
}

@Injectable()
export class AuthService {
  private tokenBlackList = new Set<string>();

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    loginUserDto: LoginUserDto,
  ): Promise<Omit<User, 'password'> | null> {
    const { username, password } = loginUserDto;
    const user = await this.userRepository.findOne({ where: { username } });

    // If user is not found
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const passwordVerified = await bcrypt.compare(password, user.password);

    if (user && passwordVerified) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: any): Promise<{ access_token: string }> {
    const payload: JwtPayload = { username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  addToBlackList(token: string): void {
    this.tokenBlackList.add(token);
  }

  isTokenBlackListed(token: string): boolean {
    return this.tokenBlackList.has(token);
  }
}
