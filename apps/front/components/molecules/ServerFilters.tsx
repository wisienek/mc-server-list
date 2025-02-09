'use client';
import {FormControl, InputLabel, OutlinedInput} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import React, {type FC, useState} from 'react';
import {styled} from '@mui/material/styles';
import Button from '@mui/material/Button';
import {useTranslations} from 'next-intl';
import Box from '@mui/material/Box';
import ServerCategoriesSelect, {
    useCategories,
} from '../atoms/ServerCategoriesSelect';

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

const ServerFilters: FC = () => {
    const t = useTranslations('filters');

    const {
        selectedCategories,
        triggerCategory,
        showCategoriesContainer,
        setShowCategoriesContainer,
    } = useCategories();

    const [searchText, setSearchText] = useState<string>('');

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
