import {styled} from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import {type ComponentProps, useState} from 'react';
import ServerCategoryMapper from '@front/components/consts/ServerCategoryMapper';
import {ServerCategory} from '@shared/enums';

const StyledCategoryIconProps = Object.freeze({
    color: '',
});

const StyledCategoryIcon = styled(Avatar, {
    shouldForwardProp: (name: string) =>
        !Object.keys(StyledCategoryIconProps).includes(name),
})<{color: string}>(({theme, color}) => ({
    width: 'auto',
    height: 'auto',
    fontSize: '1rem',
    backgroundColor: color,
    overflow: 'visible',
    borderRadius: theme.spacing(1),
}));

const StyledBadgeIcon = styled(Badge)(() => ({
    position: 'absolute',
    right: '0px',
    top: '0px',
    cursor: 'pointer',
}));

type CategoryIconProps = {
    category: ServerCategory;
    onRemove?: (category: ServerCategory) => void;
} & Partial<ComponentProps<typeof StyledCategoryIcon>>;

const CategoryIcon = ({category, onRemove, ...rest}: CategoryIconProps) => {
    const config = ServerCategoryMapper[category];
    const [isHovered, setIsHovered] = useState<boolean>(false);

    return (
        <Tooltip
            title={category}
            arrow
            slots={{transition: Fade}}
            slotProps={{transition: {timeout: 500}}}
        >
            <Box
                sx={{position: 'relative', display: 'inline-flex'}}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <StyledCategoryIcon color={config.color} {...rest}>
                    {config.icon}
                </StyledCategoryIcon>

                {onRemove && isHovered && (
                    <Fade in={isHovered}>
                        <StyledBadgeIcon
                            onClick={() => onRemove(category)}
                            badgeContent={isHovered ? 'x' : 0}
                            color="error"
                            overlap="circular"
                            {...(isHovered ? {timeout: 1000} : {})}
                        />
                    </Fade>
                )}
            </Box>
        </Tooltip>
    );
};

export default CategoryIcon;
