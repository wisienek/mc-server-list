'use client';
import {type AppStore, makeStore} from '@lib/front/components/store/store';
import React, {useRef} from 'react';
import {Provider} from 'react-redux';
import InitializeAuth from '../store/InitializeAuth';

interface ProvidersProps {
    children: React.ReactNode;
}

function Providers({children}: ProvidersProps) {
    const storeRef = useRef<AppStore | null>(null);
    if (!storeRef.current) {
        storeRef.current = makeStore();
    }

    return (
        <Provider store={storeRef.current}>
            <InitializeAuth />
            {children}
        </Provider>
    );
}

export default Providers;
