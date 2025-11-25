import { UserAuth } from '#shared/types/index';
import { Link } from '@inertiajs/react';
import { ThemeToggle } from '~/components/common/theme_toggle';
import { withAuth } from '~/hooks/use_auth';

export const Navbar = withAuth(
	({ auth }: { auth: UserAuth }) =>
		auth.isAuthenticated && (
			<header className="border-b border-slate-700 bg-slate-800 rounded-xl">
				<div className="px-6 py-4 flex items-center justify-between">
					<div className="flex items-center gap-4">
						{auth.user!.minecraftUsername && (
							<img
								src={`https://minotar.net/helm/${auth.user!.minecraftUsername}/48`}
								alt={auth.user!.minecraftUsername}
								className="rounded-lg"
								width={48}
								height={48}
							/>
						)}
						<div>
							<h2 className="text-lg font-semibold text-white">
								{auth.user!.minecraftUsername}
							</h2>
							{auth.user!.email && (
								<p className="text-sm text-slate-400">{auth.user!.email}</p>
							)}
						</div>
					</div>
					<div className="flex items-center gap-4">
						<Link
							href="/auth/logout"
							className="px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition"
						>
							Déconnexion
						</Link>
						<ThemeToggle />
					</div>
				</div>
			</header>
		)
);
