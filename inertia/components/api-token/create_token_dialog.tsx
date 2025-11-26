import {
	Button,
	Dialog,
	DialogDismiss,
	DialogHeading,
	useDialogStore,
} from '@ariakit/react';
import { usePage, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export function CreateTokenDialog() {
	const dialog = useDialogStore();
	const { props } = usePage<{ flash?: { createdToken?: string } }>();
	const [createdToken, setCreatedToken] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);

	const { data, setData, post, processing, errors, reset } = useForm({
		name: '',
	});

	useEffect(() => {
		if (props.flash?.createdToken) {
			setCreatedToken(props.flash.createdToken);
			dialog.show();
		}
	}, [props.flash?.createdToken]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		post('/api-tokens', {
			preserveScroll: true,
		});
	};

	const handleCopy = async () => {
		if (createdToken) {
			await navigator.clipboard.writeText(createdToken);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const handleClose = () => {
		dialog.hide();
		setCreatedToken(null);
		setCopied(false);
		reset();
	};

	return (
		<>
			<Button onClick={() => dialog.show()} className="button-primary">
				Créer un token
			</Button>
			<Dialog
				store={dialog}
				backdrop={<div className="backdrop" />}
				className="dialog"
			>
				<DialogHeading className="heading">
					{createdToken ? 'Token créé' : 'Nouveau token API'}
				</DialogHeading>

				{createdToken ? (
					<div className="flex flex-col gap-4">
						<p className="text-sm text-amber-600 dark:text-amber-400">
							Copiez ce token maintenant. Il ne sera plus affiché.
						</p>
						<div className="flex gap-2">
							<input
								type="text"
								readOnly
								value={createdToken}
								className="input flex-1 font-mono text-sm"
							/>
							<Button onClick={handleCopy} className="button-secondary">
								{copied ? 'Copié !' : 'Copier'}
							</Button>
						</div>
						<DialogDismiss onClick={handleClose} className="button-primary">
							Fermer
						</DialogDismiss>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<div>
							<label
								htmlFor="token-name"
								className="block text-sm font-medium text-slate-500 dark:text-slate-500 mb-2"
							>
								Nom du token
							</label>
							<input
								id="token-name"
								type="text"
								value={data.name}
								onChange={(e) => setData('name', e.target.value)}
								className="input"
								placeholder="Mon mod Minecraft"
							/>
							{errors.name && <p className="input-error">{errors.name}</p>}
						</div>

						<div className="flex gap-3 pt-2">
							<DialogDismiss
								type="button"
								onClick={handleClose}
								className="button-secondary"
							>
								Annuler
							</DialogDismiss>
							<Button
								type="submit"
								disabled={processing}
								className="button-primary"
							>
								{processing ? 'Création...' : 'Créer'}
							</Button>
						</div>
					</form>
				)}
			</Dialog>
		</>
	);
}
