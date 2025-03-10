import {getUserData} from '@front/components/actions/getUserData';
import LocaleSwitcher from './LocaleSwitcher';
import StyledProfileContainer from './StyledProfileContainer';
import ThemeSwitch from './dark-mode-switcher/ThemeSwitch';
import LoginWithDiscord from './LoginWithDiscord';
import StandardLogin from './StandardLogin';
import UserProfile from './UserProfileIcon';
import Logout from './Logout';

export default async function Profile() {
    const user = await getUserData();

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
