import {
  IsNotEmpty,
  MaxLength,
  IsEmail,
  IsStrongPassword,
  IsDate,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Primeiro nome não pode ser vazio.' })
  firstname: string;

  @IsNotEmpty({ message: 'Sobrenome não pode ser vazio.' })
  lastname: string;

  @IsNotEmpty({ message: 'Nome de usuário não pode ser vazio.' })
  @MaxLength(32, {
    message: 'O limite é de 32 caracteres para nomes de usuário.',
  })
  username: string;

  @IsNotEmpty({ message: 'E-mail não pode ser vazio.' })
  @IsEmail({}, { message: 'E-mail inválido.' })
  email: string;

  @IsNotEmpty({ message: 'Senha não pode ser vazio.' })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
    minNumbers: 1,
  })
  password: string;

  @IsNotEmpty({ message: 'Senha não pode ser vazio.' })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
    minNumbers: 1,
  })
  confirmPassword: string;

  @IsNotEmpty({ message: 'Data de nascimento não pode ser vazio.' })
  @IsDate({ message: 'Data de nascimento não é uma data válida.' })
  birthAt: Date;
}
