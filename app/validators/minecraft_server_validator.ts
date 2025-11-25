import vine from '@vinejs/vine';

export const createServerValidator = vine.compile(
	vine.object({
		name: vine.string().trim().minLength(1).maxLength(64),
		host: vine.string().trim().minLength(1),
		port: vine.number().min(1).max(65535),
		version: vine.string().trim().minLength(1),
	})
);

export const updateServerValidator = vine.compile(
	vine.object({
		name: vine.string().trim().minLength(1).maxLength(64),
		host: vine.string().trim().minLength(1),
		port: vine.number().min(1).max(65535),
		version: vine.string().trim().minLength(1),
	})
);
