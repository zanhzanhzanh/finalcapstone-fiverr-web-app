import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
// This use for defalut AuthGuard('local')
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
        super({
            // Must reassign for username and password
            usernameField: 'email',
            passwordField: 'password',
        });
    }

    async validate(email: string, password: string): Promise<any> {
        const user = await this.authService.validateUser({ email, password });
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}