'use client';
import CreateServerModalContents from '@front/components/molecules/CreateServerModalContents';
import VerifyServerModalContents from '@front/components/molecules/VerifyServerModalContents';
import Modal from '@front/components/atoms/Modal';
import {
    CreateServerDto,
    CreateServerResponseDto,
    ServerSummaryDto,
} from '@shared/dto';

export type ModalMode = 'create' | 'verify';

interface ServerModalProps {
    open: boolean;
    handleClose: () => void;
    modalMode: ModalMode;
    setModalMode: (mode: ModalMode) => void;
    serverToVerify?: ServerSummaryDto | null;
    setServerResponse?: (data: CreateServerResponseDto) => void;
    setCreateData?: (data: CreateServerDto) => void;
    serverResponse?: CreateServerResponseDto;
    createData?: CreateServerDto;
}

function ServerModal({
    open,
    handleClose,
    modalMode,
    serverToVerify,
    setServerResponse,
    setCreateData,
}: ServerModalProps) {
    const renderContent = () => {
        if (modalMode === 'create') {
            return (
                <CreateServerModalContents
                    handleClose={handleClose}
                    setServerResponse={setServerResponse!}
                    setCreateDto={setCreateData!}
                />
            );
        }

        if (modalMode === 'verify' && serverToVerify) {
            return <VerifyServerModalContents server={serverToVerify} />;
        }

        return null;
    };

    return (
        <Modal open={open} onClose={handleClose}>
            {renderContent()}
        </Modal>
    );
}

export default ServerModal;
