'use client';
import {useTranslations} from 'next-intl';
import React, {type FC, useState} from 'react';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
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
                <TextField
                    fullWidth
                    variant="outlined"
                    label={t('searchLabel')}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
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
