import vine from '@vinejs/vine';

export const loginValidator = vine.compile(
	vine.object({
		email: vine.string().email(),
		password: vine.string().minLength(6),
	})
);

export const registerValidator = vine.compile(
	vine.object({
		minecraftUsername: vine
			.string()
			.trim()
			.minLength(3)
			.maxLength(16)
			.unique(async (db, value) => {
				const user = await db
					.from('users')
					.where('minecraft_username', value)
					.first();
				return !user;
			}),
		email: vine
			.string()
			.email()
			.unique(async (db, value) => {
				const user = await db.from('users').where('email', value).first();
				return !user;
			}),
		password: vine
			.string()
			.minLength(6)
			.confirmed({ confirmationField: 'passwordConfirmation' }),
	})
);
