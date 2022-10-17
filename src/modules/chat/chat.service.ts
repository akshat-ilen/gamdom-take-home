import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInputError } from 'apollo-server-express';
import { CHAT_CHANNEL_PREFIX } from 'src/common/constants';
import { Repository } from 'typeorm';
import { AuthenticationService } from '../authentication/authentication.service';
import { User } from '../authentication/entities/user.entity';
import { ChatInput } from './dto/chat.input';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    private readonly authenticationService: AuthenticationService,
  ) {}

  async getMessages(
    senderId: string,
    receiverId: string,
    pageNo: number,
    limit: number,
  ) {
    this.logger.log(`getMessages BEGIN:: users: ${senderId} & ${receiverId}`);
    return this.chatRepository.find({
      where: [
        { sender: { id: senderId }, receiver: { id: receiverId } },
        { sender: { id: receiverId }, receiver: { id: senderId } },
      ],
      skip: (pageNo - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['sender', 'receiver'],
    });
  }

  async addMessage(sender: User, chatInput: ChatInput) {
    this.logger.log(
      `addMessage BEGIN:: ${sender.id} sending message to ${chatInput.receiverId}`,
    );
    const { message, receiverId } = chatInput;

    const receiver = await this.authenticationService.getUserById(receiverId);

    if (!receiver) throw new UserInputError(`Invalid receiver's Id`);

    const newMessage = this.chatRepository.create({
      message,
      receiver,
      sender,
    });

    const messageAdded = await this.chatRepository.save(newMessage);
    const channel = this.createChatChannelName(sender.id, receiver.id);

    return { message: messageAdded, channel };
  }

  async createChatChannel(
    selfId: string,
    otherPersonId: string,
  ): Promise<string> {
    this.logger.log(
      `createChatChannel BEGIN:: users: ${selfId} & ${otherPersonId}`,
    );
    const otherPerson = await this.authenticationService.getUserById(
      otherPersonId,
    );

    if (!otherPerson) throw new UserInputError(`Invalid receiver's Id`);

    return this.createChatChannelName(selfId, otherPersonId);
  }

  private createChatChannelName(user1Id: string, user2Id: string) {
    const [person1, person2] = [user1Id, user2Id].sort();
    return `${CHAT_CHANNEL_PREFIX}-${person1}-${person2}`;
  }
}
