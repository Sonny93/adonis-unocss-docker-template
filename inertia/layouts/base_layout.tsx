import '@minimalstuff/ui/style.css';
import React from 'react';
import 'virtual:uno.css';
import '~/css/app.css';

export const BaseLayout = ({ children }: React.PropsWithChildren) => (
	<>{children}</>
);
