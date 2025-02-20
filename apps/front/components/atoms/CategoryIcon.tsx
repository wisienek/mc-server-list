import Avatar from '@mui/material/Avatar';
import Fade from '@mui/material/Fade';
import {styled} from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import {ServerCategory} from '@shared/enums';
import ServerCategoryMapper from '@front/components/consts/ServerCategoryMapper';
import {type ComponentProps} from 'react';

const StyledCategoryIconProps = Object.freeze({
    color: '',
});

const StyledCategoryIcon = styled(Avatar, {
    shouldForwardProp: (name: string) =>
        !Object.keys(StyledCategoryIconProps).includes(name),
})<{color: string}>(({theme, color}) => ({
    width: theme.spacing(3),
    height: theme.spacing(3),
    fontSize: '1rem',
    backgroundColor: color,
}));

type CategoryIconProps = {
    category: ServerCategory;
} & Partial<ComponentProps<typeof StyledCategoryIcon>>;

const CategoryIcon = ({category, ...rest}: CategoryIconProps) => {
    const config = ServerCategoryMapper[category];

    return (
        <Tooltip
            title={category}
            arrow
            slots={{transition: Fade}}
            slotProps={{transition: {timeout: 500}}}
        >
            <StyledCategoryIcon color={config.color} {...rest}>
                {config.icon}
            </StyledCategoryIcon>
        </Tooltip>
    );
};

export default CategoryIcon;
