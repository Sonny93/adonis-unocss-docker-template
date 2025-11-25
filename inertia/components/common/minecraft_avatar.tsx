export const MinecraftAvatar = ({
	username,
	size = 64,
}: {
	username: string;
	size?: number;
}) => (
	<img
		src={`https://minotar.net/helm/${username}/${size}`}
		alt={username}
		className="rounded-lg"
		width={size}
		height={size}
	/>
);
