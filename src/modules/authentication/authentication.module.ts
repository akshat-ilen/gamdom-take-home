import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { User } from './entities/user.entity';
import { AuthenticationResolver } from './authentication.resolver';
import { AuthenticationService } from './authentication.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Session])],
  providers: [AuthenticationResolver, AuthenticationService],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
