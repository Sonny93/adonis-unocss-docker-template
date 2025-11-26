import { UserAuth } from '#shared/types/index';
import { Link } from '@inertiajs/react';
import { ThemeToggle } from '~/components/common/theme_toggle';
import { withAuth } from '~/hooks/use_auth';

export const Navbar = withAuth(({ auth }: { auth: UserAuth }) =>
	auth.isAuthenticated ? (
		<header className="border-b border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800 rounded-xl mb-6">
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
						<h2 className="text-lg font-semibold text-black dark:text-white">
							{auth.user!.minecraftUsername}
						</h2>
						{auth.user!.email && (
							<p className="text-sm text-slate-500 dark:text-slate-500">
								{auth.user!.email}
							</p>
						)}
					</div>
				</div>
				<div className="flex items-center gap-4">
					<Link href="/logout" className="button">
						Déconnexion
					</Link>
					<ThemeToggle />
				</div>
			</div>
		</header>
	) : (
		<ThemeToggle />
	)
);
