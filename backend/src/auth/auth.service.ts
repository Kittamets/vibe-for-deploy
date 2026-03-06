import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import * as argon2 from 'argon2';
import { User, AuthProvider } from '../models/user.model';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private jwtService: JwtService,
  ) {}

  async loginLocal(dto: LoginDto) {
    const user = await this.userModel.findOne({ where: { email: dto.email } });

    if (!user || user.auth_provider !== AuthProvider.LOCAL) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await argon2.verify(user.password_hash, dto.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.issueToken(user);
  }

  async loginGoogle(email: string) {
    const user = await this.userModel.findOne({ where: { email } });

    if (!user || user.auth_provider !== AuthProvider.GOOGLE) {
      throw new UnauthorizedException('No account linked to this Google email');
    }

    return this.issueToken(user);
  }

  issueToken(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }

  async getMe(userId: number) {
    const user = await this.userModel.findByPk(userId, {
      attributes: ['id', 'email', 'role', 'auth_provider'],
    });
    return user;
  }
}
