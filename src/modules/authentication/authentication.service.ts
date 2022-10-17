import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInputError } from 'apollo-server-express';
import { SESSION_TOKEN_EXPIRES_IN_HOURS } from 'src/common/constants';
import * as GraphQLTypes from 'src/common/graphql-types';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { AuthInput } from './dto/auth.input';
import { Session } from './entities/session.entity';
import { User } from './entities/user.entity';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async signUp(input: AuthInput): Promise<GraphQLTypes.Login> {
    this.logger.log(`signUp BEGIN for username: ${input.username}`);
    const existingUser = await this.getUserByUsername(input.username);

    if (existingUser)
      throw new UserInputError(
        'Username already exist, please try differnt one',
      );

    const user = this.userRepository.create({ ...input });
    const newUserEntity = await this.userRepository.save(user);

    const session = await this.createSessionForUser(newUserEntity);

    return { user: newUserEntity, session };
  }

  async signIn({ username, password }: AuthInput): Promise<GraphQLTypes.Login> {
    this.logger.log(`signUp BEGIN for username: ${username}`);
    const user = await this.getUserByUsername(username);

    if (!user) throw new UserInputError('Invalid nickname');

    if (!(await user.comparePassword(password)))
      throw new UserInputError('Invalid password');

    const session = await this.createSessionForUser(user);

    return { user, session };
  }

  async logout(userId: string): Promise<GraphQLTypes.Message> {
    this.logger.log(`logout BEGIN for userId: ${userId}`);
    const sessions = await this.sessionRepository.find({
      where: { user: { id: userId }, expiresAt: MoreThanOrEqual(new Date()) },
    });

    await this.sessionRepository.softRemove(sessions);

    return { message: 'User has been logout successfully' };
  }

  async validateToken(token: string): Promise<User> {
    this.logger.log(`validateToken BEGIN for token: ${token}`);
    const session = await this.sessionRepository.findOne({
      where: { token, expiresAt: MoreThanOrEqual(new Date()) },
      select: { user: { id: true, username: true } },
      relations: { user: true },
    });

    return session ? session.user : null;
  }

  async getUserById(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  private async createSessionForUser(user: User): Promise<Session> {
    this.logger.log(
      `createSessionForUser BEGIN for username: ${user.username}`,
    );
    const oldSession = await this.sessionRepository.findOne({
      where: { user: { id: user.id }, expiresAt: MoreThanOrEqual(new Date()) },
    });

    if (oldSession) return oldSession;

    const session = this.sessionRepository.create({
      user,
      expiresAt: this.getExpiryTime(),
    });

    return this.sessionRepository.save(session);
  }

  private getExpiryTime(): Date {
    const now = new Date();
    now.setTime(
      now.getTime() + SESSION_TOKEN_EXPIRES_IN_HOURS * 60 * 60 * 1000,
    );
    return now;
  }

  private async getUserByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne({ where: { username } });
  }
}
