import { UserDto } from '#dtos/user';
import User from '#models/user';

export class UserAuthDto {
	declare isAuthenticated: boolean;
	declare user?: UserDto;

	constructor(user: User | undefined) {
		if (!user) return;
		this.isAuthenticated = !!user;
		this.user = user && new UserDto(user);
	}

	serialize(): {
		isAuthenticated: boolean;
		user: ReturnType<UserDto['serialize']> | undefined;
	} {
		return {
			isAuthenticated: this.isAuthenticated,
			user: this.user?.serialize(),
		};
	}
}
