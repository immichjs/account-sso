import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/User';
import { MailModule } from './modules/mail/mail.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'viper-pay',
      entities: [User],
      synchronize: true,
    }),
    MailModule,
    AuthenticationModule,
  ],
})
export class AppModule {}
