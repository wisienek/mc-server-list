'use client';
import InitializeAuth, {
    InitializeAuthProps,
} from '@front/components/store/InitializeAuth';
import {type AppStore, makeStore} from '@lib/front/components/store/store';
import React, {type ReactNode, useRef} from 'react';
import {Provider} from 'react-redux';

interface ProvidersProps {
    children: ReactNode;
    auth: InitializeAuthProps;
}

function Providers({children, auth}: ProvidersProps) {
    const storeRef = useRef<AppStore | null>(null);
    if (!storeRef.current) {
        storeRef.current = makeStore();
    }

    return (
        <Provider store={storeRef.current}>
            <InitializeAuth {...auth} />
            {children}
        </Provider>
    );
}

export default Providers;
