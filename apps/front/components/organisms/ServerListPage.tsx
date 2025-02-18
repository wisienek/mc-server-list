'use client';
import {ListServersDto, ServerSummaryDto} from '@shared/dto';
import {useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import StyledPageContainer from '../atoms/StyledPageContainer';
import ServerFilters from '../molecules/ServerFilters';
import ServerSummaryList from '../molecules/ServerSummary';
import {serverListQuery} from '../queries/servers/serverListQuery';
import ServerModal, {type ModalMode} from './CreateServerModal';

const ServerListPage = () => {
    const [searchData, setSearchData] = useState<ListServersDto>({isOwn: false});
    const fetchServersQuery = serverListQuery(searchData);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalMode, setModalMode] = useState<ModalMode>('create');
    const [modalContainer, setModalContainer] = useState<HTMLElement | null>(null);
    const [serverToVerify, setServerToVerify] = useState<ServerSummaryDto | null>(
        null,
    );

    useEffect(() => {
        setModalContainer(document.getElementById('modal-root'));
    }, []);

    const handleOpenVerifyModal = (server: ServerSummaryDto) => {
        setModalMode('verify');
        setServerToVerify(server);
        setShowModal(true);
    };

    return (
        <StyledPageContainer>
            {showModal &&
                modalContainer &&
                createPortal(
                    <ServerModal
                        open={showModal}
                        handleClose={() => {
                            setShowModal(false);
                            setServerToVerify(null);
                        }}
                        modalMode={modalMode}
                        setModalMode={setModalMode}
                        serverToVerify={serverToVerify}
                    />,
                    modalContainer,
                )}

            <ServerFilters
                setSearchData={setSearchData}
                setShowingCreateModal={(value: boolean) => {
                    setModalMode('create');
                    setShowModal(value);
                }}
            />
            <ServerSummaryList
                fetchServersQuery={fetchServersQuery}
                setShowVerificationModal={handleOpenVerifyModal}
            />
        </StyledPageContainer>
    );
};

export default ServerListPage;
