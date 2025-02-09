'use client';
import {useState} from 'react';
import CreateServerModalContents from '@front/components/molecules/CreateServerModalContents';
import VerifyServerModalContents from '@front/components/molecules/VerifyServerModalContents';
import Modal from '@front/components/atoms/Modal';
import {CreateServerDto, CreateServerResponseDto} from '@shared/dto';

interface CreateServerModalProps {
    open: boolean;
    handleClose: () => void;
}

export default function CreateServerModal({
    open,
    handleClose,
}: CreateServerModalProps) {
    const [createDto, setCreateDto] = useState<CreateServerDto>(null);
    const [serverResponse, setServerResponse] =
        useState<CreateServerResponseDto>(null);

    const ModalContents = () => {
        if (!serverResponse) {
            return (
                <CreateServerModalContents
                    handleClose={handleClose}
                    setServerResponse={(data) => setServerResponse(data)}
                    setCreateDto={(data) => setCreateDto(data)}
                />
            );
        }

        return (
            <VerifyServerModalContents
                serverResponse={serverResponse}
                createData={createDto}
            />
        );
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <ModalContents />
        </Modal>
    );
}
