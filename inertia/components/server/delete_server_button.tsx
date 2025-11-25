import { Button } from '@ariakit/react';
import { router } from '@inertiajs/react';

interface Props {
	serverId: number;
}

export function DeleteServerButton({ serverId }: Props) {
	const handleDelete = () => {
		router.delete(`/servers/${serverId}`);
	};

	return (
		<Button onClick={handleDelete} className="button-secondary text-red-400">
			Supprimer
		</Button>
	);
}
