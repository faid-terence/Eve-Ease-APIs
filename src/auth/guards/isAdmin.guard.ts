import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class IsAdminGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const { authorization }: any = request.headers;
      if (!authorization || authorization.trim() === '') {
        throw new UnauthorizedException('Please provide token');
      }
      const authToken = authorization.replace(/bearer/gim, '').trim();
      const userData = await this.authService.validateToken(authToken);
      if (!userData || !userData.id) {
        throw new ForbiddenException('Invalid token or user data');
      }
      // Attach user information to req.user
      request.user = userData;
      if (userData.role !== 'admin') {
        throw new ForbiddenException(
          'You are not authorized to perform this action',
        );
      }
      return true;
    } catch (error) {}
  }
}
