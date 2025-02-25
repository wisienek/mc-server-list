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
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
        >
            <IconButton
                onClick={handleFavoriteClick}
                size="small"
                sx={{cursor: profile ? 'pointer' : 'not-allowed'}}
                disabled={!profile}
            >
                <FavoriteIcon sx={{color: isLikedByUser ? 'red' : 'grey'}} />
            </IconButton>
            <Typography variant="caption">{votes}</Typography>
        </Box>
    );
};

export default ServerLikeButton;
