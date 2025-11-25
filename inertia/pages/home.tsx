import { Head } from '@inertiajs/react';
import { MinecraftAvatar } from '~/components/common/minecraft_avatar';

interface Bot {
	id: number;
	username: string;
	gameVersion: string;
	createdAt: string;
}

interface Props {
	bots: Bot[];
}

const Home = ({ bots }: Props) => (
	<>
		<Head title="Dashboard" />
		<div className="flex items-center justify-between mb-8">
			<h1 className="text-2xl font-bold text-white">Mes Bots</h1>
			<button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition">
				Nouveau Bot
			</button>
		</div>

		{bots.length === 0 ? (
			<div className="text-center py-16 bg-slate-800 rounded-2xl">
				<p className="text-slate-400">Aucun bot configuré</p>
			</div>
		) : (
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{bots.map((bot) => (
					<div
						key={bot.id}
						className="p-5 bg-slate-800 rounded-xl border border-slate-700 hover:border-slate-600 transition"
					>
						<div className="flex items-center gap-4">
							<MinecraftAvatar username={bot.username} size={56} />
							<div className="flex-1 min-w-0">
								<h3 className="text-lg font-semibold text-white truncate">
									{bot.username}
								</h3>
								<p className="text-sm text-slate-400">
									Minecraft {bot.gameVersion}
								</p>
							</div>
						</div>
						<div className="mt-4 flex gap-2">
							<button className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition">
								Démarrer
							</button>
							<button className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium rounded-lg transition">
								Configurer
							</button>
						</div>
					</div>
				))}
			</div>
		)}
	</>
);

export default Home;
