import { Bot } from '#shared/types/index';
import {
	Button,
	Dialog,
	DialogDismiss,
	DialogHeading,
	useDialogStore,
} from '@ariakit/react';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

interface EditBotDialogProps {
	bot: Pick<Bot, 'id' | 'username'>;
}

export function EditBotDialog({ bot }: EditBotDialogProps) {
	const editBotDialog = useDialogStore();

	const { data, setData, put, processing, errors, reset } = useForm({
		username: '',
	});

	useEffect(() => {
		setData({
			username: bot.username,
		});
	}, [bot]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		put(`/bots/${bot.id}`, {
			onSuccess: () => {
				reset();
				editBotDialog.hide();
			},
		});
	};

	return (
		<>
			<Button onClick={() => editBotDialog.show()} className="button-secondary">
				Modifier le bot
			</Button>
			<Dialog
				store={editBotDialog}
				backdrop={<div className="backdrop" />}
				className="dialog"
			>
				<DialogHeading className="heading">Modification d'un bot</DialogHeading>
				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<div>
						<label
							htmlFor="username"
							className="block text-sm font-medium text-slate-500 dark:text-slate-500 mb-2"
						>
							Pseudo Minecraft
						</label>
						<input
							id="username"
							type="text"
							value={data.username}
							onChange={(e) => setData('username', e.target.value)}
							className="input"
							placeholder="Steve"
						/>
						{errors.username && (
							<p className="input-error">{errors.username}</p>
						)}
					</div>
					<div className="flex gap-3 pt-2">
						<DialogDismiss
							type="button"
							onClick={() => {
								editBotDialog.hide();
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
