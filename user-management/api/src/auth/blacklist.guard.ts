import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ERROR_MESSAGES } from '../constants/messages';

@Injectable()
export class BlacklistGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) {
      return true;
    }

    const token = request.headers.authorization.split(' ')[1];
    if (this.authService.isTokenBlackListed(token)) {
      throw new UnauthorizedException(ERROR_MESSAGES.NOT_LOGGED_IN);
    }
    return true;
  }
}
