import { TuyauProvider } from '@adonisjs/inertia/react';
import '@minimalstuff/ui/style.css';
import React from 'react';
import 'virtual:uno.css';
import '~/css/app.css';
import { tuyauClient } from '~/lib/tuyau';

export const BaseLayout = ({ children }: React.PropsWithChildren) => (
	<TuyauProvider client={tuyauClient}>{children}</TuyauProvider>
);
