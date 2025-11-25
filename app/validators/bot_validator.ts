import vine from '@vinejs/vine';

export const createBotValidator = vine.compile(
	vine.object({
		username: vine.string().trim().minLength(3).maxLength(16),
	})
);

export const updateBotValidator = vine.compile(
	vine.object({
		username: vine.string().trim().minLength(3).maxLength(16),
	})
);
