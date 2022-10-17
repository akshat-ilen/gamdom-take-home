
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class AuthInput {
    username: string;
    password: string;
}

export class AddChatMessageInput {
    message: string;
    receiverId: string;
}

export class ChatQueryInput {
    chatUserId: string;
    pageNo: number;
    limit?: Nullable<number>;
}

export class User {
    id: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
}

export class Session {
    token: string;
}

export class Login {
    user: User;
    session: Session;
}

export class Message {
    message: string;
}

export abstract class IMutation {
    signUp?: Nullable<Login>;
    signIn?: Nullable<Login>;
    logout: Message;
    addMessage?: Nullable<ChatMessage>;
}

export class ChatMessage {
    id: string;
    message: string;
    sender: User;
    receiver: User;
    createdAt: Date;
    updatedAt: Date;
}

export abstract class IQuery {
    chats?: Nullable<Nullable<ChatMessage>[]>;
}

export abstract class ISubscription {
    chat?: Nullable<ChatMessage>;
}

type Nullable<T> = T | null;
