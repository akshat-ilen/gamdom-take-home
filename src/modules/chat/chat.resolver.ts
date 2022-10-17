import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { SkipThrottle } from '@nestjs/throttler';
import { PubSub } from 'graphql-subscriptions';
import { UserContext } from 'src/common/custom-decorators';
import * as GraphQLTypes from 'src/common/graphql-types';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { WsAuthGuard } from 'src/common/guards/ws-auth.guard';
import { User } from '../authentication/entities/user.entity';
import { ChatService } from './chat.service';
import { ChatInput } from './dto/chat.input';
import { ChatQueryInput } from './dto/chatQuery.input';

@Resolver('Chat')
export class ChatResolver {
  private pubSub: PubSub;
  constructor(private readonly chatService: ChatService) {
    this.pubSub = new PubSub();
  }

  @UseGuards(AuthGuard)
  @Mutation('addMessage')
  async addMessage(
    @UserContext() user: User,
    @Args('input') input: ChatInput,
  ): Promise<GraphQLTypes.ChatMessage> {
    const { message, channel } = await this.chatService.addMessage(user, input);
    this.pubSub.publish(channel, { chat: message });
    return message;
  }

  @UseGuards(AuthGuard)
  @Query('chats')
  getChatMessages(
    @UserContext() user: User,
    @Args('input') input: ChatQueryInput,
  ) {
    return this.chatService.getMessages(
      user.id,
      input.chatUserId,
      input.pageNo,
      input.limit,
    );
  }

  @SkipThrottle()
  @UseGuards(WsAuthGuard)
  @Subscription('chat')
  async chatAdded(
    @UserContext() user: User,
    @Args('receiverId', ParseUUIDPipe) receiverId: string,
  ) {
    const channelName = await this.chatService.createChatChannel(
      user.id,
      receiverId,
    );
    return this.pubSub.asyncIterator(channelName);
  }
}
