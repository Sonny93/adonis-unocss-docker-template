import AppBaseModel from '#models/app_base_model';
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid';
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens';
import { compose } from '@adonisjs/core/helpers';
import hash from '@adonisjs/core/services/hash';
import { column } from '@adonisjs/lucid/orm';

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
	uids: ['email'],
	passwordColumnName: 'password',
});

export default class User extends compose(AppBaseModel, AuthFinder) {
	static accessTokens = DbAccessTokensProvider.forModel(User);
	@column()
	declare minecraftUsername: string;

	@column()
	declare email: string;

	@column({ serializeAs: null })
	declare password: string;
}
