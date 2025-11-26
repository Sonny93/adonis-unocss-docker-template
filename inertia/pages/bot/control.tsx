import type { Bot, BotInstance, MinecraftServer } from '#shared/types/index';
import {
	Button,
	Select,
	SelectItem,
	SelectPopover,
	useSelectStore,
} from '@ariakit/react';
import { Head, Link, router } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MinecraftAvatar } from '~/components/common/minecraft_avatar';
import type { Job } from '../../../app/bot/jobs/types.js';
import type { WorkerOutgoingMessage } from '../../../app/bot/types.js';

interface Props {
	bot: Bot;
	servers: MinecraftServer[];
	instance: BotInstance | null;
}

interface ChatMessage {
	type: 'chat' | 'system';
	username?: string;
	message: string;
	timestamp: Date;
}

interface BotState {
	status: BotInstance['status'] | 'offline';
	health: number;
	food: number;
	position: { x: number; y: number; z: number } | null;
	currentJob: Job | null;
}

export default function BotControl({ bot, servers, instance }: Props) {
	const [state, setState] = useState<BotState>({
		status: instance?.status ?? 'offline',
		health: 20,
		food: 20,
		position: null,
		currentJob: null,
	});
	const [woodAmount, setWoodAmount] = useState(10);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [chatInput, setChatInput] = useState('');
	const [gotoCoords, setGotoCoords] = useState({ x: '', y: '', z: '' });
	const [selectedServerId, setSelectedServerId] = useState<string>(
		servers[0]?.id.toString() ?? ''
	);
	const [loading, setLoading] = useState(false);
	const [connected, setConnected] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const wsRef = useRef<WebSocket | null>(null);

	const serverSelect = useSelectStore({
		value: selectedServerId,
		setValue: setSelectedServerId,
	});

	const selectedServer = useMemo(
		() => servers.find((s) => s.id.toString() === selectedServerId),
		[servers, selectedServerId]
	);

	useEffect(() => {
		const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
		const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);
		wsRef.current = ws;

		ws.onopen = () => setConnected(true);
		ws.onclose = () => setConnected(false);

		ws.onmessage = (message) => {
			const data: { botId: string; event: WorkerOutgoingMessage } = JSON.parse(
				message.data
			);
			if (data.botId !== String(bot.id)) return;

			handleBotEvent(data.event);
		};

		return () => ws.close();
	}, [bot.id]);

	const handleBotEvent = useCallback((event: WorkerOutgoingMessage) => {
		switch (event.type) {
			case 'spawned':
				setState((s) => ({ ...s, status: 'running' }));
				addSystemMessage('Spawned');
				break;
			case 'stopped':
				setState((s) => ({ ...s, status: 'offline', position: null }));
				addSystemMessage('Disconnected');
				break;
			case 'kicked':
				setState((s) => ({ ...s, status: 'offline', position: null }));
				addSystemMessage(`Kick: ${event.reason}`);
				break;
			case 'death':
				addSystemMessage('Dead');
				break;
			case 'error':
				setState((s) => ({ ...s, status: 'error' }));
				addSystemMessage(`Error: ${event.message}`);
				break;
			case 'health':
				setState((s) => ({ ...s, health: event.health, food: event.food }));
				break;
			case 'position':
				setState((s) => ({
					...s,
					position: { x: event.x, y: event.y, z: event.z },
				}));
				break;
			case 'chat':
				setMessages((prev) => [
					...prev,
					{
						type: 'chat',
						username: event.username,
						message: event.message,
						timestamp: new Date(),
					},
				]);
				break;
			case 'job:update':
				setState((s) => ({
					...s,
					currentJob:
						event.job.status === 'completed' ||
						event.job.status === 'cancelled' ||
						event.job.status === 'failed'
							? null
							: event.job,
				}));
				if (event.job.status === 'completed') {
					addSystemMessage(`Job terminé: ${event.job.type}`);
				} else if (event.job.status === 'failed') {
					addSystemMessage(
						`Job échoué: ${event.job.error || 'Erreur inconnue'}`
					);
				}
				break;
		}
	}, []);

	const addSystemMessage = (message: string) => {
		setMessages((prev) => [
			...prev,
			{ type: 'system', message, timestamp: new Date() },
		]);
	};

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const postAction = (
		endpoint: string,
		data: Record<string, string | number> = {},
		onSuccess?: () => void
	) => {
		router.post(
			`/bot-instances/${bot.id}/${endpoint}`,
			data as unknown as FormData,
			{
				preserveState: true,
				preserveScroll: true,
				onSuccess,
			}
		);
	};

	const handleStart = () => {
		if (!selectedServerId) return;
		setLoading(true);
		setState((s) => ({ ...s, status: 'starting' }));
		postAction('start', { serverId: Number(selectedServerId) }, () =>
			setLoading(false)
		);
	};

	const handleStop = () => {
		setLoading(true);
		setState((s) => ({ ...s, status: 'stopping' }));
		postAction('stop', {}, () => setLoading(false));
	};

	const handleChat = (e: React.FormEvent) => {
		e.preventDefault();
		if (!chatInput.trim()) return;
		postAction('chat', { message: chatInput }, () => setChatInput(''));
	};

	const handleGoto = (e: React.FormEvent) => {
		e.preventDefault();
		const { x, y, z } = gotoCoords;
		if (!x || !y || !z) return;
		postAction('goto', { x: Number(x), y: Number(y), z: Number(z) });
		addSystemMessage(`Téléportation vers ${x}, ${y}, ${z}`);
	};

	const handleCollectWood = () => {
		postAction('jobs/collect-wood', { amount: woodAmount });
		addSystemMessage(`Job lancé: collecter ${woodAmount} bois`);
	};

	const handleCancelJob = () => {
		postAction('jobs/cancel');
		addSystemMessage('Annulation du job en cours');
	};

	const isRunning = state.status === 'running';
	const canStart =
		state.status === 'offline' ||
		state.status === 'stopped' ||
		state.status === 'error';

	return (
		<>
			<Head title={`Bot - ${bot.username}`} />

			<div className="mb-6">
				<Link
					href="/"
					className="text-slate-400 hover:text-white transition inline-flex items-center gap-2"
				>
					<svg
						className="w-4 h-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 19l-7-7 7-7"
						/>
					</svg>
					Retour au dashboard
				</Link>
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				{/* Status Panel */}
				<div className="lg:col-span-1 flex flex-col gap-6">
					{/* Bot Info */}
					<div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
						<div className="flex items-center gap-4 mb-6">
							<MinecraftAvatar username={bot.username} size={64} />
							<div>
								<h1 className="text-xl font-bold text-black dark:text-white">
									{bot.username}
								</h1>
								<div className="flex items-center gap-2 mt-1">
									<span
										className={`w-2 h-2 rounded-full ${
											isRunning
												? 'bg-emerald-500'
												: state.status === 'starting' ||
													  state.status === 'stopping'
													? 'bg-amber-500 animate-pulse'
													: 'bg-slate-500'
										}`}
									/>
									<span className="text-sm text-slate-400 capitalize">
										{state.status === 'offline' ? 'Hors ligne' : state.status}
									</span>
								</div>
							</div>
						</div>

						{/* WebSocket Status */}
						<div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
							<span
								className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-500' : 'bg-red-500'}`}
							/>
							WebSocket {connected ? 'connecté' : 'déconnecté'}
						</div>

						{/* Server Selection */}
						{canStart && (
							<div className="mb-4">
								<label className="block text-sm font-medium text-slate-500 mb-2">
									Serveur
								</label>
								<Select store={serverSelect} className="input w-full text-left">
									{selectedServer?.name ?? 'Sélectionner un serveur'}
								</Select>
								<SelectPopover
									store={serverSelect}
									className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg shadow-lg overflow-hidden z-50"
								>
									{servers.map((server) => (
										<SelectItem
											key={server.id}
											value={server.id.toString()}
											className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer text-black dark:text-white"
										>
											{server.name} ({server.host}:{server.port})
										</SelectItem>
									))}
								</SelectPopover>
							</div>
						)}

						{/* Start/Stop Button */}
						{canStart ? (
							<Button
								onClick={handleStart}
								disabled={loading || !selectedServerId}
								className="button-primary w-full"
							>
								{loading ? 'Démarrage...' : 'Démarrer le bot'}
							</Button>
						) : (
							<Button
								onClick={handleStop}
								disabled={loading || state.status === 'stopping'}
								className="w-full px-4 py-2 text-sm font-medium rounded-lg transition bg-red-600 hover:bg-red-500 text-white cursor-pointer"
							>
								{loading ? 'Arrêt...' : 'Arrêter le bot'}
							</Button>
						)}
					</div>

					{/* Stats */}
					{isRunning && (
						<div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
							<h2 className="text-lg font-semibold text-black dark:text-white mb-4">
								Statistiques
							</h2>

							{/* Health Bar */}
							<div className="mb-4">
								<div className="flex justify-between text-sm mb-1">
									<span className="text-slate-400">Vie</span>
									<span className="text-red-400">{state.health}/20</span>
								</div>
								<div className="h-2 bg-slate-700 rounded-full overflow-hidden">
									<div
										className="h-full bg-red-500 transition-all duration-300"
										style={{ width: `${(state.health / 20) * 100}%` }}
									/>
								</div>
							</div>

							{/* Food Bar */}
							<div className="mb-4">
								<div className="flex justify-between text-sm mb-1">
									<span className="text-slate-400">Faim</span>
									<span className="text-amber-400">{state.food}/20</span>
								</div>
								<div className="h-2 bg-slate-700 rounded-full overflow-hidden">
									<div
										className="h-full bg-amber-500 transition-all duration-300"
										style={{ width: `${(state.food / 20) * 100}%` }}
									/>
								</div>
							</div>

							{/* Position */}
							{state.position && (
								<div>
									<span className="text-slate-400 text-sm">Position</span>
									<p className="text-white font-mono text-sm mt-1">
										X: {state.position.x.toFixed(1)} Y:{' '}
										{state.position.y.toFixed(1)} Z:{' '}
										{state.position.z.toFixed(1)}
									</p>
								</div>
							)}
						</div>
					)}

					{/* Goto Form */}
					{isRunning && (
						<div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
							<h2 className="text-lg font-semibold text-black dark:text-white mb-4">
								Téléportation
							</h2>
							<form onSubmit={handleGoto} className="space-y-3">
								<div className="grid grid-cols-3 gap-2">
									<input
										type="number"
										placeholder="X"
										value={gotoCoords.x}
										onChange={(e) =>
											setGotoCoords((c) => ({ ...c, x: e.target.value }))
										}
										className="input text-center"
									/>
									<input
										type="number"
										placeholder="Y"
										value={gotoCoords.y}
										onChange={(e) =>
											setGotoCoords((c) => ({ ...c, y: e.target.value }))
										}
										className="input text-center"
									/>
									<input
										type="number"
										placeholder="Z"
										value={gotoCoords.z}
										onChange={(e) =>
											setGotoCoords((c) => ({ ...c, z: e.target.value }))
										}
										className="input text-center"
									/>
								</div>
								<Button type="submit" className="button-primary w-full">
									Téléporter
								</Button>
							</form>
						</div>
					)}

					{/* Jobs Panel */}
					{isRunning && (
						<div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
							<h2 className="text-lg font-semibold text-black dark:text-white mb-4">
								Jobs
							</h2>

							{state.currentJob && (
								<div className="mb-4 p-3 bg-slate-700 rounded-lg">
									<div className="flex justify-between items-center mb-2">
										<span className="text-sm text-slate-300">
											{state.currentJob.type === 'collect_wood'
												? 'Collecte de bois'
												: state.currentJob.type}
										</span>
										<span className="text-xs px-2 py-1 rounded bg-amber-500 text-white">
											{state.currentJob.status}
										</span>
									</div>
									{state.currentJob.type === 'collect_wood' && (
										<div className="mb-2">
											<div className="flex justify-between text-xs text-slate-400 mb-1">
												<span>Progression</span>
												<span>
													{state.currentJob.params.collected}/
													{state.currentJob.params.amount}
												</span>
											</div>
											<div className="h-2 bg-slate-600 rounded-full overflow-hidden">
												<div
													className="h-full bg-emerald-500 transition-all duration-300"
													style={{
														width: `${(state.currentJob.params.collected / state.currentJob.params.amount) * 100}%`,
													}}
												/>
											</div>
										</div>
									)}
									<Button
										onClick={handleCancelJob}
										className="w-full mt-2 px-3 py-1.5 text-xs font-medium rounded bg-red-600 hover:bg-red-500 text-white cursor-pointer"
									>
										Annuler
									</Button>
								</div>
							)}

							<div className="space-y-3">
								<div>
									<label className="block text-sm text-slate-400 mb-1">
										Collecter du bois
									</label>
									<div className="flex gap-2">
										<input
											type="number"
											min="1"
											max="64"
											value={woodAmount}
											onChange={(e) => setWoodAmount(Number(e.target.value))}
											className="input w-20 text-center"
											disabled={!!state.currentJob}
										/>
										<Button
											onClick={handleCollectWood}
											disabled={!!state.currentJob}
											className="button-primary flex-1"
										>
											Collecter
										</Button>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Chat Panel */}
				<div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 flex flex-col h-[calc(100vh-12rem)]">
					<div className="p-4 border-b border-gray-200 dark:border-slate-700">
						<h2 className="text-lg font-semibold text-black dark:text-white">
							Chat & Logs
						</h2>
					</div>

					<div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-sm">
						{messages.length === 0 ? (
							<p className="text-slate-500 text-center py-8">
								Aucun message pour le moment
							</p>
						) : (
							messages.map((msg, i) => (
								<div
									key={i}
									className={
										msg.type === 'system'
											? 'text-slate-500 italic'
											: 'text-slate-300'
									}
								>
									<span className="text-slate-600 text-xs mr-2">
										{msg.timestamp.toLocaleTimeString()}
									</span>
									{msg.type === 'chat' ? (
										<>
											<span className="text-emerald-400">
												&lt;{msg.username}&gt;
											</span>{' '}
											{msg.message}
										</>
									) : (
										<span className="text-amber-400">[Système]</span>
									)}{' '}
									{msg.type === 'system' && msg.message}
								</div>
							))
						)}
						<div ref={messagesEndRef} />
					</div>

					<form
						onSubmit={handleChat}
						className="p-4 border-t border-gray-200 dark:border-slate-700 flex gap-2"
					>
						<input
							type="text"
							value={chatInput}
							onChange={(e) => setChatInput(e.target.value)}
							placeholder={
								isRunning ? 'Envoyer un message...' : 'Bot hors ligne'
							}
							disabled={!isRunning}
							className="input flex-1"
						/>
						<Button
							type="submit"
							disabled={!isRunning || !chatInput.trim()}
							className="button-primary"
						>
							Envoyer
						</Button>
					</form>
				</div>
			</div>
		</>
	);
}
