'use client';
import CreateServerModalContents from '@front/components/molecules/CreateServerModalContents';
import VerifyServerModalContents from '@front/components/molecules/VerifyServerModalContents';
import Modal from '@front/components/atoms/Modal';
import {
    CreateServerDto,
    CreateServerResponseDto,
    ServerSummaryDto,
} from '@shared/dto';
import {useAppDispatch} from '@lib/front/components/store/store';
import {addNotification} from '@lib/front/components/store/notificationsSlice';
import {useTranslations} from 'next-intl';

export type ModalMode = 'create' | 'verify';

interface ServerModalProps {
    open: boolean;
    handleClose: () => void;
    modalMode: ModalMode;
    serverToVerify?: ServerSummaryDto | null;
    setCreateData?: (data: CreateServerDto) => void;
    serverResponse?: CreateServerResponseDto;
}

function ServerModal({
    open,
    handleClose,
    modalMode,
    serverToVerify,
}: ServerModalProps) {
    const t = useTranslations('server');
    const dispatch = useAppDispatch();

    const renderContent = () => {
        if (modalMode === 'create') {
            return (
                <CreateServerModalContents
                    handleClose={handleClose}
                    setServerResponse={(data) => {
                        dispatch(
                            addNotification({
                                id: 'success-create-server',
                                level: 'Success',
                                title: t('created.title'),
                                description: t('created.description', {
                                    host: data.host,
                                }),
                            }),
                        );
                        handleClose();
                    }}
                />
            );
        }

        if (modalMode === 'verify' && serverToVerify) {
            return (
                <VerifyServerModalContents
                    server={serverToVerify}
                    handleClose={handleClose}
                />
            );
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
