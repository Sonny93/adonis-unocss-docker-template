import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

const Login = () => {
	const { data, setData, post, processing, errors } = useForm({
		email: '',
		password: '',
	});

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		post('/login');
	};

	return (
		<>
			<Head title="Login" />
			<div className="w-full max-w-md mx-auto mt-25 p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl">
				<h1 className="text-3xl font-bold text-black dark:text-white mb-8 text-center">
					Connexion
				</h1>

				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-slate-500 dark:text-slate-500 mb-2"
						>
							Email
						</label>
						<input
							id="email"
							type="email"
							value={data.email}
							onChange={(e) => setData('email', e.target.value)}
							className="input"
							placeholder="email@example.com"
							autoComplete="email"
						/>
						{errors.email && <p className="input-error">{errors.email}</p>}
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-slate-500 dark:text-slate-500 mb-2"
						>
							Mot de passe
						</label>
						<input
							id="password"
							type="password"
							value={data.password}
							onChange={(e) => setData('password', e.target.value)}
							className="input"
							placeholder="••••••••"
							autoComplete="current-password"
						/>
						{errors.password && (
							<p className="input-error">{errors.password}</p>
						)}
					</div>

					<button
						type="submit"
						disabled={processing}
						className="button-primary"
					>
						{processing ? 'Connexion...' : 'Se connecter'}
					</button>
				</form>
			</div>
		</>
	);
};

export default Login;
