import Avatar from '@mui/material/Avatar';
import Fade from '@mui/material/Fade';
import {styled} from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import {ServerCategory} from '@shared/enums';
import ServerCategoryMapper from '@front/components/consts/ServerCategoryMapper';

const StyledCategoryIcon = styled(Avatar)(({theme}) => ({
    width: theme.spacing(3),
    height: theme.spacing(3),
    fontSize: '1rem',
}));

type CategoryIconProps = {
    category: ServerCategory;
};

const CategoryIcon = ({category}: CategoryIconProps) => {
    const config = ServerCategoryMapper[category];

    return (
        <Tooltip
            title={category}
            arrow
            slots={{transition: Fade}}
            slotProps={{transition: {timeout: 500}}}
        >
            <StyledCategoryIcon sx={{backgroundColor: config.color}}>
                {config.icon}
            </StyledCategoryIcon>
        </Tooltip>
    );
};

export default CategoryIcon;
