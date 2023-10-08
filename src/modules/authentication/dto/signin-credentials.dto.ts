import { IsNotEmpty, IsStrongPassword, MaxLength } from 'class-validator';
export class SignInCredentials {
  @IsNotEmpty({ message: 'Nome de usuário não pode ser vazio.' })
  @MaxLength(32, {
    message: 'O limite é de 32 caracteres para nomes de usuário.',
  })
  username: string;

  @IsNotEmpty({ message: 'Senha não pode ser vazio.' })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
    minNumbers: 1,
  })
  password: string;
}
