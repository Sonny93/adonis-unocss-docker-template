import { BotDto } from '#dtos/bot';
import { MinecraftServerDto } from '#dtos/minecraft_server';
import { UserDto } from '#dtos/user';
import { UserAuthDto } from '#dtos/user_auth';

export type UserAuth = ReturnType<UserAuthDto['serialize']>;
export type Bot = ReturnType<BotDto['serialize']>;
export type User = ReturnType<UserDto['serialize']>;
export type MinecraftServer = ReturnType<MinecraftServerDto['serialize']>;
