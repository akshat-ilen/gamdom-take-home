import { IsNumber, IsPositive, IsUUID, Max } from 'class-validator';
import * as GraphQLTypes from 'src/common/graphql-types';

export class ChatQueryInput extends GraphQLTypes.ChatQueryInput {
  @IsUUID()
  chatUserId: string;

  @IsPositive()
  pageNo: number;

  @IsPositive()
  @IsNumber()
  @Max(50)
  limit: number;
}
