import User from '#models/user';
import type { HttpContext } from '@adonisjs/core/http';

export default class ApiTokensController {
	async index({ auth }: HttpContext) {
		const user = auth.getUserOrFail();
		const tokens = await User.accessTokens.all(user);
		return tokens.map((t) => ({
			id: t.identifier,
			name: t.name,
			abilities: t.abilities,
			lastUsedAt: t.lastUsedAt,
			expiresAt: t.expiresAt,
			createdAt: t.createdAt,
		}));
	}

	async store({ auth, request, response, session }: HttpContext) {
		const user = auth.getUserOrFail();
		const { name } = request.only(['name']);

		if (!name || typeof name !== 'string') {
			return response.badRequest({ error: 'Name is required' });
		}

		const token = await User.accessTokens.create(user, ['*'], { name });

		session.flash('createdToken', token.value!.release());
		return response.redirect().back();
	}

	async destroy({ auth, params, response }: HttpContext) {
		const user = auth.getUserOrFail();
		const tokenId = params.id;

		const tokens = await User.accessTokens.all(user);
		const token = tokens.find((t) => t.identifier === tokenId);

		if (!token) {
			return response.notFound({ error: 'Token not found' });
		}

		await User.accessTokens.delete(user, token.identifier);
		return response.noContent();
	}
}
