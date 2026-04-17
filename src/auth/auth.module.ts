import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Auth } from './model/auth.entity';

@Module({
  imports: [SequelizeModule.forFeature([Auth])],
  providers: [AuthService],
})
export class AuthModule {}
