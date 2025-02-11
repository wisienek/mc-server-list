'use client';

import {QueryClientProvider} from '@tanstack/react-query';
import {type ReactNode, useState} from 'react';
import {getQueryClient} from './getQueryClient';

export const ReactQueryClientProvider = ({children}: {children: ReactNode}) => {
    const [queryClient] = useState(() => getQueryClient());

    return (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};
