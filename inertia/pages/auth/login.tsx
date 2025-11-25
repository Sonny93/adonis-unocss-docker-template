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
			<div className="min-h-screen flex items-center justify-center bg-slate-900">
				<div className="w-full max-w-md p-8 bg-slate-800 rounded-2xl shadow-2xl">
					<h1 className="text-3xl font-bold text-white mb-8 text-center">
						Connexion
					</h1>

					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-slate-300 mb-2"
							>
								Email
							</label>
							<input
								id="email"
								type="email"
								value={data.email}
								onChange={(e) => setData('email', e.target.value)}
								className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
								placeholder="email@example.com"
							/>
							{errors.email && (
								<p className="mt-2 text-sm text-red-400">{errors.email}</p>
							)}
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-slate-300 mb-2"
							>
								Mot de passe
							</label>
							<input
								id="password"
								type="password"
								value={data.password}
								onChange={(e) => setData('password', e.target.value)}
								className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
								placeholder="••••••••"
							/>
							{errors.password && (
								<p className="mt-2 text-sm text-red-400">{errors.password}</p>
							)}
						</div>

						<button
							type="submit"
							disabled={processing}
							className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200"
						>
							{processing ? 'Connexion...' : 'Se connecter'}
						</button>
					</form>
				</div>
			</div>
		</>
	);
};

export default Login;
