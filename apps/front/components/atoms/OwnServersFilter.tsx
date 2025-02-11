'use client';

import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import {useTranslations} from 'next-intl';
import {type FC} from 'react';

const FilterContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1),
}));

type OwnServersFilterProps = {
    showOwnServers: boolean;
    toggleOwnServers: () => void;
};

const OwnServersFilter: FC<OwnServersFilterProps> = ({
    showOwnServers,
    toggleOwnServers,
}) => {
    const t = useTranslations('filters');
    return (
        <FilterContainer>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={showOwnServers}
                        onChange={toggleOwnServers}
                        color="primary"
                    />
                }
                label={t('showMyServers')}
                sx={{
                    userSelect: 'none',
                }}
            />
        </FilterContainer>
    );
};

export default OwnServersFilter;
