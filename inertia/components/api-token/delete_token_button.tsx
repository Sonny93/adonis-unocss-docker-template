import { Button } from '@ariakit/react';
import { router } from '@inertiajs/react';

interface Props {
	tokenId: string;
}

export function DeleteTokenButton({ tokenId }: Props) {
	const handleDelete = () => {
		if (confirm('Supprimer ce token ?')) {
			router.delete(`/api-tokens/${tokenId}`, { preserveScroll: true });
		}
	};

	return (
		<Button onClick={handleDelete} className="button-danger">
			Supprimer
		</Button>
	);
}
