import { UserAuth } from '#shared/types/index';
import { SharedProps } from '@adonisjs/inertia/types';
import { usePage } from '@inertiajs/react';

const useAuth = () => usePage<SharedProps>().props.auth;
const withAuth = <T extends object>(
	Component: React.ComponentType<T & { auth: UserAuth }>
) => {
	return (props: T) => {
		const auth = useAuth();
		return <Component {...props} auth={auth} />;
	};
};

export { useAuth, withAuth };
