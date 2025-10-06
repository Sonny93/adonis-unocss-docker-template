import { Head } from '@inertiajs/react';
import { ThemeToggle } from '~/components/common/theme_toggle';

const Home = () => (
	<>
		<Head title="Homepage" />
		<ThemeToggle />
		<div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
			<div className="text-center">
				<h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
					Welcome
				</h1>
				<p className="text-gray-600 dark:text-gray-300">
					Simple template with AdonisJS + UnoCSS
				</p>
			</div>
		</div>
	</>
);

export default Home;
