'use client';
import {useAppSelector} from '@lib/front/components/store/store';
import LocaleSwitcher from './LocaleSwitcher';
import StyledProfileContainer from './StyledProfileContainer';
import ThemeSwitch from './dark-mode-switcher/ThemeSwitch';
import LoginWithDiscord from './LoginWithDiscord';
import StandardLogin from './StandardLogin';
import UserProfile from './UserProfileIcon';
import Logout from './Logout';

export default function Profile() {
    const user = useAppSelector((store) => store.auth.user);

    const UserContent = () => {
        return (
            <>
                <UserProfile user={user} />
                <Logout />
            </>
        );
    };

    const NoUserContent = () => {
        return (
            <>
                <StandardLogin />
                <LoginWithDiscord />
            </>
        );
    };

    return (
        <StyledProfileContainer>
            <LocaleSwitcher />
            <ThemeSwitch />
            {user ? <UserContent /> : <NoUserContent />}
        </StyledProfileContainer>
    );
}
