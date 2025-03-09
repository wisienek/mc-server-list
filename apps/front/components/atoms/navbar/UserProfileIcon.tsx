'use client';
import Tooltip from '@mui/material/Tooltip';
import {UserDto} from '@shared/dto';
import {FC} from 'react';
import StyledAvatar from './StyledAvatar';

type UserProfileProps = {
    user: UserDto;
};

const UserProfile: FC<UserProfileProps> = ({user}) => {
    return (
        <Tooltip arrow title={user.email}>
            <StyledAvatar
                alt="user avatar"
                src={`https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.webp?size=64`}
            />
        </Tooltip>
    );
};

export default UserProfile;
