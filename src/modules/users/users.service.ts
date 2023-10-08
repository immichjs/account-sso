import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/User';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser({
    firstname,
    lastname,
    email,
    username,
    birthAt,
    password,
    confirmPassword,
  }: CreateUserDto) {
    const hasUserByUsername = await this.userRepository.count({
      where: { username },
    });

    const hasUserByEmail = await this.userRepository.count({
      where: { username },
    });

    if (hasUserByUsername) {
      throw new BadRequestException(
        `Já existe um usuário com nome de usuário: ${username}`,
      );
    }

    if (hasUserByEmail) {
      throw new BadRequestException(
        `Já existe um usuário com e-mail: ${email}`,
      );
    }

    if (password !== confirmPassword) {
      throw new BadRequestException(`As senhas devem ser iguais.`);
    }

    const hashPassword = await hash(password, 10);

    const user = this.userRepository.create({
      firstname,
      lastname,
      username,
      email,
      birthAt,
      password: hashPassword,
    });

    const createdUser = await this.userRepository.save(user);

    return createdUser;
  }
}
