import { Injectable } from '@nestjs/common';
import { UserService } from '../shared/user.service';
import { sign } from 'jsonwebtoken';
import { Payload } from 'src/types/payload';
@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}
  async signPayload(payload: Payload) {
    return sign(payload, process.env.SECRET_KEY, {
      expiresIn: process.env.EXPIRES_IN,
    });
  }
  async validateUser(payload: Payload) {
    return await this.userService.findByPayload(payload);
  }
}
