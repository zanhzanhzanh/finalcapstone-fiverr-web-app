import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginAuthDto } from './dto/loginAuth.dto';
import { user } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async validateUser(loginAuthDto: LoginAuthDto): Promise<any> {
        const user = await this.userService.findOne({ email: loginAuthDto.email });
        if (user && user.password === loginAuthDto.password) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: user) {
        return {
            access_token: this.jwtService.sign(user),
        };
    }
}
