import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as GraphQLTypes from 'src/common/graphql-types';
import { User } from 'src/modules/authentication/entities/user.entity';

@Entity('chat')
export class Chat implements GraphQLTypes.ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  message: string;

  @ManyToOne(() => User, { nullable: false })
  sender: User;

  @ManyToOne(() => User, { nullable: false })
  receiver: User;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
