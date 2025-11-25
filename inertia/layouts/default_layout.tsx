import { Navbar } from '~/components/common/navbar';
import { BaseLayout } from '~/layouts/base_layout';
import '../css/app.css';

export const DefaultLayout = ({ children }: React.PropsWithChildren) => (
	<BaseLayout>
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<div className="max-w-[1920px] mx-auto p-4">
				<Navbar />
				{children}
			</div>
		</div>
	</BaseLayout>
);
