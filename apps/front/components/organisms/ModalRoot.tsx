'use client';

import {ModalType} from '@lib/front/components/store/modalSlice';
import {useAppSelector} from '@lib/front/components/store/store';
import React, {ComponentType, useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import dynamic from 'next/dynamic';

const MODAL_COMPONENTS = {
    login: dynamic(() => import('@front/components/molecules/LoginModal'), {
        ssr: false,
    }),
} satisfies Record<ModalType, ComponentType>;

export default function ModalRoot() {
    const {activeModal, isOpen} = useAppSelector((store) => store.modal);
    const [modalContainer, setModalContainer] = useState<HTMLElement | null>(null);

    useEffect(() => {
        setModalContainer(document.getElementById('modal-root'));
    }, []);

    if (!isOpen || !activeModal || !modalContainer) {
        return null;
    }

    const ModalComponent = MODAL_COMPONENTS[activeModal];
    if (!ModalComponent) {
        return null;
    }

    return createPortal(<ModalComponent />, modalContainer);
}
