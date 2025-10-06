/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import { PROJECT_NAME } from '#config/project';
import { resolvePageComponent } from '@adonisjs/inertia/helpers';
import { createInertiaApp } from '@inertiajs/react';
import { hydrateRoot } from 'react-dom/client';
import { BaseLayout } from '~/layouts/base_layout';

createInertiaApp({
	progress: { color: '#5468FF', delay: 100 },

	title: (title) => (title && `${title} — `) + PROJECT_NAME,

	resolve: async (name) => {
		const currentPage: any = await resolvePageComponent(
			`../pages/${name}.tsx`,
			import.meta.glob('../pages/**/*.tsx')
		);

		currentPage.default.layout =
			currentPage.default.layout || ((p: any) => <BaseLayout children={p} />);

		return currentPage;
	},

	setup({ el, App, props }) {
		hydrateRoot(el, <App {...props} />);
	},
});
