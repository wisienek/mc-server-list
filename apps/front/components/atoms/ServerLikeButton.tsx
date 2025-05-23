import {openModal} from '@lib/front/components/store/modalSlice';
import {useAppDispatch, useAppSelector} from '@lib/front/components/store/store';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

type ServerLikeButtonProps = {
    handleFavoriteClick: () => void;
    profile: unknown;
    isLikedByUser: boolean;
    votes: number;
};

const ServerLikeButton = ({
    handleFavoriteClick,
    profile,
    isLikedByUser,
    votes,
}: ServerLikeButtonProps) => {
    const user = useAppSelector((store) => store.auth.user);
    const dispatch = useAppDispatch();

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
        >
            <IconButton
                onClick={
                    user
                        ? () => handleFavoriteClick()
                        : () => dispatch(openModal('login'))
                }
                size="small"
                sx={{cursor: 'pointer'}}
            >
                <FavoriteIcon sx={{color: isLikedByUser ? 'red' : 'grey'}} />
            </IconButton>
            <Typography variant="caption">{votes}</Typography>
        </Box>
    );
};

export default ServerLikeButton;
