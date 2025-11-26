import { BotDto } from '#dtos/bot';
import { MinecraftServerDto } from '#dtos/minecraft_server';
import { UserDto } from '#dtos/user';
import { UserAuthDto } from '#dtos/user_auth';

export type UserAuth = ReturnType<UserAuthDto['serialize']>;
export type Bot = ReturnType<BotDto['serialize']>;
export type User = ReturnType<UserDto['serialize']>;
export type MinecraftServer = ReturnType<MinecraftServerDto['serialize']>;

export interface BotInstance {
	botId: string;
	username: string;
	host: string;
	port: number;
	status: 'starting' | 'running' | 'stopping' | 'stopped' | 'error';
}
