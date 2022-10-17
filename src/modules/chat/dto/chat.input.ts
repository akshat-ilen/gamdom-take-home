import { IsUUID } from 'class-validator';
import * as GraphQLTypes from 'src/common/graphql-types';

export class ChatInput extends GraphQLTypes.AddChatMessageInput {
  message: string;

  @IsUUID()
  receiverId: string;
}
