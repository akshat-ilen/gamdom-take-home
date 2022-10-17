import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserContext } from 'src/common/custom-decorators';
import { AuthGuard } from 'src/common/guards/auth.guard';
import * as GraphQLTypes from 'src/common/graphql-types';
import { AuthenticationService } from './authentication.service';
import { AuthInput } from './dto/auth.input';
import { User } from './entities/user.entity';

@Resolver('Authentication')
export class AuthenticationResolver {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Mutation('signUp')
  async signUp(@Args('input') input: AuthInput): Promise<GraphQLTypes.Login> {
    return this.authenticationService.signUp(input);
  }

  @Mutation('signIn')
  async signIn(@Args('input') input: AuthInput): Promise<GraphQLTypes.Login> {
    return this.authenticationService.signIn(input);
  }

  @UseGuards(AuthGuard)
  @Mutation('logout')
  async logout(@UserContext() user: User): Promise<GraphQLTypes.Message> {
    return this.authenticationService.logout(user.id);
  }
}
