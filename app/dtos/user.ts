import { CommonModelDto } from '#dtos/common_model';
import User from '#models/user';

export class UserDto extends CommonModelDto<User> {
	declare id: number;
	declare email: string;
	declare minecraftUsername: string;
	declare createdAt: string | null;
	declare updatedAt: string | null;

	constructor(user?: User) {
		if (!user) return;
		super(user);

		this.id = user.id;
		this.email = user.email;
		this.minecraftUsername = user.minecraftUsername;
		this.createdAt = user.createdAt?.toISO();
		this.updatedAt = user.updatedAt?.toISO();
	}

	serialize(): {
		id: number;
		email: string;
		minecraftUsername: string;
		createdAt: string | null;
		updatedAt: string | null;
	} {
		return {
			...super.serialize(),
			id: this.id,
			email: this.email,
			minecraftUsername: this.minecraftUsername,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		};
	}
}
