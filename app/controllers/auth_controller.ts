import type { HttpContext } from '@adonisjs/core/http';
import User from '#models/user';
import { loginValidator, registerValidator } from '../validators/auth_validator.js';

export default class AuthController {
	async showLogin({ inertia }: HttpContext) {
		return inertia.render('auth/login');
	}

	async showRegister({ inertia }: HttpContext) {
		return inertia.render('auth/register');
	}

	async login({ request, response, auth }: HttpContext) {
		const { email, password } = await request.validateUsing(loginValidator);

		const user = await User.verifyCredentials(email, password);
		await auth.use('web').login(user);

		return response.redirect('/');
	}

	async register({ request, response, auth }: HttpContext) {
		const payload = await request.validateUsing(registerValidator);

		const user = await User.create({
			minecraftUsername: payload.minecraftUsername,
			email: payload.email,
			password: payload.password,
		});

		await auth.use('web').login(user);
		return response.redirect('/');
	}

	async logout({ response, auth }: HttpContext) {
		await auth.use('web').logout();
		return response.redirect('/login');
	}
}
