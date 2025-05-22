import RestartAltIcon from '@mui/icons-material/RestartAlt';
import {styled} from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import {useTranslations} from 'next-intl';
import type {FC} from 'react';

const StyledResetIcon = styled(RestartAltIcon)(({theme}) => ({
    color: theme.palette.error.main,
    cursor: 'pointer',
}));

type FiltersResetProps = {
    changesDetected: boolean;
    resetChanges: () => void;
};

const FiltersReset: FC<FiltersResetProps> = ({changesDetected, resetChanges}) => {
    const t = useTranslations();

    if (!changesDetected) {
        return <></>;
    }

    return (
        <Tooltip arrow title={t('resetFilters')} onClick={() => resetChanges()}>
            <StyledResetIcon />
        </Tooltip>
    );
};

export default FiltersReset;
