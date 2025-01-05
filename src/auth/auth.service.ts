import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as lodash from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto) {
    // get the user
    const user = await this.userService.findOne(loginDto.email);
    const isPasswordMatch = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!user || !isPasswordMatch) {
      throw new NotFoundException('Invalid credentials');
    }

    // Create JWT payload based on user type
    const jwtPayload = {
      email: user.email,
      id: user.id,
    };

    // Sign and return JWT token
    const access_token = await this.jwtService.signAsync(jwtPayload);

    const refreshToken = await this.jwtService.signAsync(jwtPayload, {
      expiresIn: '7d',
    });

    await this.userService.saveRefreshToken(user.email, refreshToken);

    return {
      user: lodash.pick(user, [
        'firstName',
        'lastName',
        'email',
        'isVerified',
        'isActive',
        'createdAt',
        'updatedAt',
      ]),
      access_token,
      refreshToken,
    };
  }

  async generateNewAccessToken(user: any) {
    // Create JWT payload based on user type
  const jwtPayload = {
      email: user.email,
      id: user.id,
    };

    // Sign and return JWT token
    const access_token = await this.jwtService.signAsync(jwtPayload);

    const refreshToken = await this.jwtService.signAsync(jwtPayload, {
      expiresIn: '7d',
    });

    await this.userService.saveRefreshToken(user.email, refreshToken);

    return {
      access_token,
      refreshToken,
    };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
