import { AuthGuard } from '@nestjs/passport';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from '../shared/user.service';
import { LoginDTO, RegisterDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { Payload } from 'src/types/payload';
import { User } from 'src/utils/user.decorator';
import { SellerGuard } from 'src/guards/seller.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}
  @Post('login')
  async login(@Body() userDTO: LoginDTO) {
    const user = await this.userService.findByLogin(userDTO);
    const payload: Payload = {
      username: user.username,
      seller: user.seller,
      expiresIn: process.env.EXPIRES_IN,
    };

    const token = await this.authService.signPayload(payload);
    return { user, token };
  }
  @Post('register')
  async register(@Body() userDTO: RegisterDTO) {
    const user = await this.userService.create(userDTO);
    const payload: Payload = {
      username: user.username,
      seller: user.seller,
      expiresIn: process.env.EXPIRES_IN,
    };

    const token = await this.authService.signPayload(payload);
    return { user, token };
  }
  // @Get()
  // @UseGuards(AuthGuard('jwt'), SellerGuard)
  // async findAll(@User() user: any) {
  //   console.log(user);
  //   return await this.userService.findAll();
  // }
}
