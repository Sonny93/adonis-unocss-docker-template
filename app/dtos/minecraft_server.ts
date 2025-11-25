import { CommonModelDto } from '#dtos/common_model';
import MinecraftServer from '#models/minecraft_server';

export class MinecraftServerDto extends CommonModelDto<MinecraftServer> {
	declare id: number;
	declare name: string;
	declare host: string;
	declare port: number;
	declare version: string;
	declare createdAt: string | null;
	declare updatedAt: string | null;

	constructor(minecraftServer?: MinecraftServer) {
		if (!minecraftServer) return;
		super(minecraftServer);

		this.id = minecraftServer.id;
		this.name = minecraftServer.name;
		this.host = minecraftServer.host;
		this.port = minecraftServer.port;
		this.version = minecraftServer.version;
		this.createdAt = minecraftServer.createdAt?.toISO();
		this.updatedAt = minecraftServer.updatedAt?.toISO();
	}

	serialize(): {
		id: number;
		name: string;
		host: string;
		port: number;
		version: string;
		createdAt: string | null;
		updatedAt: string | null;
	} {
		return {
			...super.serialize(),
			id: this.id,
			name: this.name,
			host: this.host,
			port: this.port,
			version: this.version,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		};
	}
}
