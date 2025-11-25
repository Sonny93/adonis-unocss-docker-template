import { Button } from '@ariakit/react';
import { Head } from '@inertiajs/react';
import { CreateBotDialog } from '~/components/bot/create_bot_dialog';
import { EditBotDialog } from '~/components/bot/edit_bot_dialog';
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
			<h1 className="text-2xl font-bold text-black dark:text-white">
				Mes Bots
			</h1>
			<CreateBotDialog />
		</div>

		{bots.length === 0 ? (
			<div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl">
				<p className="text-slate-400">Aucun bot configuré</p>
			</div>
		) : (
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{bots.map((bot) => (
					<div
						key={bot.id}
						className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 dark:hover:border-slate-600 hover:border-gray-300 transition"
					>
						<div className="flex items-center gap-4">
							<MinecraftAvatar username={bot.username} size={56} />
							<div className="flex-1 min-w-0">
								<h3 className="text-lg font-semibold text-black dark:text-white truncate">
									{bot.username}
								</h3>
								<p className="text-sm text-slate-400 dark:text-slate-400">
									Minecraft {bot.gameVersion}
								</p>
							</div>
						</div>
						<div className="mt-4 flex gap-2">
							<Button className="button-primary">Démarrer</Button>
							<EditBotDialog bot={bot} />
						</div>
					</div>
				))}
			</div>
		)}
	</>
);

export default Home;
