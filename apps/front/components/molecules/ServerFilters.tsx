'use client';
import {FormControl, InputLabel, OutlinedInput} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import {ListServersDto} from '@shared/dto';
import {type Dispatch, type FC, type SetStateAction, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import Button from '@mui/material/Button';
import {useTranslations} from 'next-intl';
import Box from '@mui/material/Box';
import CreateServerButton from '@front/components/atoms/AddServerButton';
import OwnServersFilter from '@front/components/atoms/OwnServersFilter';
import ServerCategoriesSelect, {
    useCategories,
} from '@front/components/atoms/ServerCategoriesSelect';
import {useAppSelector} from '@lib/front/components/store/store';
import {useDebounce} from 'react-use';

const Container = styled(Box)(({theme}) => ({
    width: '100%',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
}));

const InputsContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));

type ServerFiltersProps = {
    setSearchData: Dispatch<ListServersDto>;
    setShowingCreateModal: Dispatch<SetStateAction<boolean>>;
};

const ServerFilters: FC<ServerFiltersProps> = ({
    setSearchData,
    setShowingCreateModal,
}) => {
    const t = useTranslations('filters');
    const profile = useAppSelector((state) => state.auth.user);

    const [searchText, setSearchText] = useState<string>('');
    const [showOwnServers, setShowOwnServers] = useState<boolean>(false);
    const {
        selectedCategories,
        showCategoriesContainer,
        triggerCategory,
        setShowCategoriesContainer,
    } = useCategories();

    const isFirstRun = useRef(true);
    useDebounce(
        () => {
            if (isFirstRun.current) {
                isFirstRun.current = false;
                return;
            }

            setSearchData({
                isOwn: showOwnServers,
                categories: selectedCategories,
            });
        },
        800,
        [showOwnServers, selectedCategories],
    );

    const ProfileSpecificFilters = () => {
        if (!profile) {
            return <></>;
        }

        return (
            <>
                <CreateServerButton handleOpen={() => setShowingCreateModal(true)} />
                <OwnServersFilter
                    showOwnServers={showOwnServers}
                    toggleOwnServers={() => setShowOwnServers((prev) => !prev)}
                />
            </>
        );
    };

    return (
        <Container>
            <InputsContainer>
                <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="search-input">
                        {t('searchLabel')}
                    </InputLabel>

                    <OutlinedInput
                        id="search-input"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        endAdornment={
                            <IconButton
                                type="button"
                                sx={{p: '10px'}}
                                aria-label="search"
                                color="secondary"
                            >
                                <SearchIcon />
                            </IconButton>
                        }
                        label={t('searchLabel')}
                    />
                </FormControl>

                <Button
                    variant="contained"
                    onClick={() =>
                        setShowCategoriesContainer((prevShow) => !prevShow)
                    }
                >
                    {showCategoriesContainer
                        ? t('categories.hide')
                        : t('categories.show')}
                </Button>
            </InputsContainer>

            <InputsContainer>
                <ProfileSpecificFilters />
            </InputsContainer>

            {showCategoriesContainer && (
                <ServerCategoriesSelect
                    selectedCategories={selectedCategories}
                    showCategoriesContainer={showCategoriesContainer}
                    triggerSelect={triggerCategory}
                />
            )}
        </Container>
    );
};

export default ServerFilters;
