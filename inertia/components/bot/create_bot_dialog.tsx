import {
	Button,
	Dialog,
	DialogDismiss,
	DialogHeading,
	useDialogStore,
} from '@ariakit/react';
import { useForm } from '@inertiajs/react';

export function CreateBotDialog() {
	const createBotDialog = useDialogStore();

	const { data, setData, post, processing, errors, reset } = useForm({
		username: '',
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		post('/bots', {
			onSuccess: () => {
				createBotDialog.hide();
				reset();
			},
		});
	};

	return (
		<>
			<Button onClick={() => createBotDialog.show()} className="button-primary">
				Créer un bot
			</Button>
			<Dialog
				store={createBotDialog}
				backdrop={<div className="backdrop" />}
				className="dialog"
			>
				<DialogHeading className="heading">Création d'un bot</DialogHeading>
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
								createBotDialog.hide();
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
							{processing ? 'Création...' : 'Créer'}
						</DialogDismiss>
					</div>
				</form>
			</Dialog>
		</>
	);
}
