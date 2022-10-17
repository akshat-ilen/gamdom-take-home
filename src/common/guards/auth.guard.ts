import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthenticationError } from 'apollo-server-express';
import { AuthenticationService } from 'src/modules/authentication/authentication.service';
import { AUTHORISATION_HEADER_ATTRIBUTE } from '../constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(AuthenticationService)
    private readonly authenticationService: AuthenticationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    const authCode: string = ctx?.req?.headers[AUTHORISATION_HEADER_ATTRIBUTE];

    if (!authCode) throw new AuthenticationError('Missing Authorisation code');

    const user = await this.authenticationService.validateToken(authCode);
    if (!user)
      throw new AuthenticationError('Invalid/Expired Authorisation code');

    ctx.user = user;
    return true;
  }
}
