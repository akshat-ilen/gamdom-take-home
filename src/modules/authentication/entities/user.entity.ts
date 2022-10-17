import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as GraphQLTypes from 'src/common/graphql-types';
import * as bcrypt from 'bcrypt';
import { Session } from './session.entity';

@Entity('user')
export class User implements GraphQLTypes.User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index({ unique: true })
  username: string;

  @Column()
  password: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @JoinTable()
  @OneToMany(() => Session, (session) => session.user)
  session: Session[];

  @BeforeInsert() async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(currentPassword: string): Promise<boolean> {
    return await bcrypt.compare(currentPassword, this.password);
  }
}
