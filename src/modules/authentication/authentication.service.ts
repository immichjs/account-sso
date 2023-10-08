import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entity/User';
import { SignInCredentials } from './dto/signin-credentials.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpCredentials } from './dto/signup-credentials.dto';
import { UsersService } from '../users/users.service';

import { compare } from 'bcryptjs';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  createToken(
    { id, firstname, lastname, email, username }: User,
    { audience, issuer, expiresIn }: any,
  ) {
    const accessToken = this.jwtService.sign(
      {
        sub: id,
        firstname,
        lastname,
        email,
        username,
      },
      {
        expiresIn,
        audience,
        issuer,
      },
    );

    return {
      accessToken,
    };
  }

  verifyToken(token: string, options: any) {
    try {
      const data = this.jwtService.verify(token, options);

      return data;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  isValidToken(token: string, options: any) {
    try {
      this.verifyToken(token, options);

      return true;
    } catch (_) {
      return false;
    }
  }

  async signIn({ username, password }: SignInCredentials) {
    const user = await this.userRepository.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    if (user && !(await compare(password, user.password))) {
      throw new UnauthorizedException('Senha incorreta.');
    }

    const { accessToken } = this.createToken(user, {
      audience: 'users',
      issuer: 'signin',
      expiresIn: '3d',
    });

    return {
      user,
      accessToken,
    };
  }

  async signUp(signUpCredentials: SignUpCredentials) {
    const user = await this.usersService.createUser(signUpCredentials);

    const { accessToken: confirmToken } = await this.createToken(user, {
      audience: 'users',
      issuer: 'mail',
      expiresIn: '1m',
    });

    this.mailService.sendEmail(
      user.email,
      'Confirmação de e-mail no Viper Pagamentos.',
      `http://localhost:3000/authentication/confirm/${confirmToken}`,
    );

    const { accessToken } = this.createToken(user, {
      audience: 'users',
      issuer: 'signup',
      expiresIn: '3d',
    });

    return {
      user,
      accessToken,
    };
  }

  async confirmEmail(token: string) {
    const isValidToken = this.isValidToken(token, {
      audience: 'users',
      issuer: 'mail',
    });
    if (!isValidToken) {
      throw new UnauthorizedException('Token inválido.');
    }

    const decodedToken = this.jwtService.decode(token);

    const user = await this.userRepository.findOne({
      where: { id: decodedToken.sub },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    user.status = true;

    await this.userRepository.save(user);

    return {
      message: `E-mail (${decodedToken['email']}) foi confirmado!`,
    };
  }
}
