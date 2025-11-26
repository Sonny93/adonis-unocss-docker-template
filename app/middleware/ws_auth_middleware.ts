import type { HttpContext } from '@adonisjs/core/http';
import logger from '@adonisjs/core/services/logger';
import type { NextFn } from '@adonisjs/core/types/http';

export type WsClientType = 'frontend' | 'mod';

declare module '@adonisjs/core/http' {
	interface HttpContext {
		wsClientType?: WsClientType;
	}
}

export default class WsAuthMiddleware {
	async handle(ctx: HttpContext, next: NextFn) {
		const { request, auth } = ctx;

		const authHeader = request.header('authorization');
		const isApiRequest = authHeader?.startsWith('Bearer ');
		logger.info(`[WsAuthMiddleware] isApiRequest: ${isApiRequest}`);
		if (isApiRequest) {
			await auth.authenticateUsing(['api']);
			ctx.wsClientType = 'mod';
		} else {
			await auth.authenticateUsing(['web']);
			ctx.wsClientType = 'frontend';
		}

		return next();
	}
}
