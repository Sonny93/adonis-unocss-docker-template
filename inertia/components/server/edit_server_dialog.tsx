import { MinecraftServer } from '#shared/types/index';
import {
	Button,
	Dialog,
	DialogDismiss,
	DialogHeading,
	useDialogStore,
} from '@ariakit/react';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

interface Props {
	server: MinecraftServer;
}

export function EditServerDialog({ server }: Props) {
	const dialog = useDialogStore();

	const { data, setData, put, processing, errors, reset } = useForm({
		name: '',
		host: '',
		port: 25565,
		version: '',
	});

	useEffect(() => {
		setData({
			name: server.name,
			host: server.host,
			port: server.port,
			version: server.version,
		});
	}, [server]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		put(`/servers/${server.id}`, {
			onSuccess: () => {
				reset();
				dialog.hide();
			},
		});
	};

	return (
		<>
			<Button onClick={() => dialog.show()} className="button-secondary">
				Modifier
			</Button>
			<Dialog
				store={dialog}
				backdrop={<div className="backdrop" />}
				className="dialog"
			>
				<DialogHeading className="heading">Modifier le serveur</DialogHeading>
				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<div>
						<label
							htmlFor="name"
							className="block text-sm font-medium text-slate-500 dark:text-slate-500 mb-2"
						>
							Nom
						</label>
						<input
							id="name"
							type="text"
							value={data.name}
							onChange={(e) => setData('name', e.target.value)}
							className="input"
							placeholder="Mon serveur"
						/>
						{errors.name && <p className="input-error">{errors.name}</p>}
					</div>

					<div>
						<label
							htmlFor="host"
							className="block text-sm font-medium text-slate-500 dark:text-slate-500 mb-2"
						>
							Adresse
						</label>
						<input
							id="host"
							type="text"
							value={data.host}
							onChange={(e) => setData('host', e.target.value)}
							className="input"
							placeholder="play.example.com"
						/>
						{errors.host && <p className="input-error">{errors.host}</p>}
					</div>

					<div>
						<label
							htmlFor="port"
							className="block text-sm font-medium text-slate-500 dark:text-slate-500 mb-2"
						>
							Port
						</label>
						<input
							id="port"
							type="number"
							value={data.port}
							onChange={(e) => setData('port', Number(e.target.value))}
							className="input"
							placeholder="25565"
						/>
						{errors.port && <p className="input-error">{errors.port}</p>}
					</div>

					<div>
						<label
							htmlFor="version"
							className="block text-sm font-medium text-slate-500 dark:text-slate-500 mb-2"
						>
							Version
						</label>
						<input
							id="version"
							type="text"
							value={data.version}
							onChange={(e) => setData('version', e.target.value)}
							className="input"
							placeholder="1.21.8"
						/>
						{errors.version && <p className="input-error">{errors.version}</p>}
					</div>

					<div className="flex gap-3 pt-2">
						<DialogDismiss
							type="button"
							onClick={() => {
								dialog.hide();
								reset();
							}}
							className="button-secondary"
						>
							Annuler
						</DialogDismiss>
						<DialogDismiss
							type="submit"
							disabled={processing}
							className="button-primary"
						>
							{processing ? 'Modification...' : 'Modifier'}
						</DialogDismiss>
					</div>
				</form>
			</Dialog>
		</>
	);
}
