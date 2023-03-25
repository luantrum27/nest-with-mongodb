import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDTO, RegisterDTO } from 'src/auth/auth.dto';
import { User } from '../types/user';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}
  sanitizeUser(user: User) {
    const sanitized = user.toObject();
    delete sanitized['password'];
    return sanitized;
  }

  async create(userDTO: RegisterDTO) {
    const { username } = userDTO;
    const user = await this.userModel.findOne({ username });
    if (user)
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    const newUser = new this.userModel(userDTO);
    await newUser.save();
    return this.sanitizeUser(newUser);
  }

  async findByLogin(userDTO: LoginDTO) {
    const { username, password } = userDTO;
    const user = await this.userModel.findOne({ username });
    if (!user)
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    const check = await bcrypt.compare(password, user.password);
    if (!check)
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    return this.sanitizeUser(user);
  }

  async findByPayload(payload: any) {
    const { username } = payload;
    return await this.userModel.findOne({ username });
  }

  async findAll() {
    return;
  }
}
