import { Bot, MinecraftServer } from '#shared/types/index';
import { Head, Link } from '@inertiajs/react';
import { CreateBotDialog } from '~/components/bot/create_bot_dialog';
import { EditBotDialog } from '~/components/bot/edit_bot_dialog';
import { MinecraftAvatar } from '~/components/common/minecraft_avatar';
import { CreateServerDialog } from '~/components/server/create_server_dialog';
import { DeleteServerButton } from '~/components/server/delete_server_button';
import { EditServerDialog } from '~/components/server/edit_server_dialog';

interface Props {
	bots: Bot[];
	servers: MinecraftServer[];
}

const Home = ({ bots, servers }: Props) => (
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
							</div>
						</div>
						<div className="mt-4 flex gap-2">
							<Link
								href={`/bots/${bot.id}/control`}
								className="button-primary"
							>
								Contrôler
							</Link>
							<EditBotDialog bot={bot} />
						</div>
					</div>
				))}
			</div>
		)}

		<div className="flex items-center justify-between mb-8 mt-12">
			<h1 className="text-2xl font-bold text-black dark:text-white">
				Serveurs
			</h1>
			<CreateServerDialog />
		</div>

		{servers.length === 0 ? (
			<div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl">
				<p className="text-slate-400">Aucun serveur configuré</p>
			</div>
		) : (
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{servers.map((server) => (
					<div
						key={server.id}
						className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 dark:hover:border-slate-600 hover:border-gray-300 transition"
					>
						<div className="flex-1 min-w-0">
							<h3 className="text-lg font-semibold text-black dark:text-white truncate">
								{server.name}
							</h3>
							<p className="text-sm text-slate-400">
								{server.host}:{server.port}
							</p>
							<p className="text-sm text-slate-500">{server.version}</p>
						</div>
						<div className="mt-4 flex gap-2">
							<EditServerDialog server={server} />
							<DeleteServerButton serverId={server.id} />
						</div>
					</div>
				))}
			</div>
		)}
	</>
);

export default Home;
