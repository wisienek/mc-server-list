'use client';
import React, {useRef} from 'react';
import {Provider} from 'react-redux';
import InitializeAuth from '../store/InitializeAuth';
import {type AppStore, makeStore} from '../store/store';

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
