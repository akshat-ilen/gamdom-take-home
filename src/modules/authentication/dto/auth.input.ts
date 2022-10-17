import { MinLength } from 'class-validator';
import * as GraphQLTypes from 'src/common/graphql-types';

export class AuthInput extends GraphQLTypes.AuthInput {
  @MinLength(6)
  username: string;

  @MinLength(8)
  password: string;
}
