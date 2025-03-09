'use client';
import {LogoIcon} from './icons';
import {useRouter} from '@front/i18n/routing';
import {StyledLogo, StyledTitle} from './navbar/StyledLogo';

const MenuLogo = () => {
    const router = useRouter();

    return (
        <StyledLogo onClick={() => router.push('/')}>
            <LogoIcon width={60} />
            <StyledTitle variant="h6" noWrap>
                MSL
            </StyledTitle>
        </StyledLogo>
    );
};

export default MenuLogo;
