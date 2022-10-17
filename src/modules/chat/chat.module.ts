import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from '../authentication/authentication.module';
import { ChatResolver } from './chat.resolver';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat]), AuthenticationModule],
  providers: [ChatResolver, ChatService],
})
export class ChatModule {}
