'use client';
import {ListServersDto, ServerSummaryDto} from '@shared/dto';
import {useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import useSyncSearchDataToUrl from '@front/components/hooks/useSyncSearchDataToURL';
import {serverListQuery} from '@front/components/queries/servers/serverListQuery';
import StyledPageContainer from '@front/components/atoms/StyledPageContainer';
import ServerSummaryList from '@front/components/molecules/ServerSummary';
import ServerFilters from '@front/components/molecules/ServerFilters';
import ServerModal, {type ModalMode} from './CreateServerModal';

type ServerListPageProps = {
    initialSearchData?: ListServersDto;
};

const ServerListPage = ({initialSearchData}: ServerListPageProps) => {
    const [searchData, setSearchData] = useState<ListServersDto>(
        initialSearchData ?? {isOwn: false},
    );

    useSyncSearchDataToUrl(searchData);

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
                searchData={searchData}
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
