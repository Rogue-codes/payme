import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { EmailModule } from 'src/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OTP, User } from './entities/user.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { BalanceModule } from 'src/balance/balance.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, OTP]),
    EmailModule,
    CacheModule.register({
      max: 100,
      ttl: 3600000,
    }),
    BalanceModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
