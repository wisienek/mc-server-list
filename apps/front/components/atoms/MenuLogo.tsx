import Typography from '@mui/material/Typography';
import Logo from './icons/logo.svg';
import {styled} from '@mui/material/styles';
import {useRouter} from '@front/i18n/routing';

const StyledLogo = styled('div')(({theme}) => ({
    userSelect: 'none',
    height: theme.spacing(8),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing(1),
    cursor: 'pointer',

    [theme.breakpoints.down('sm')]: {
        display: 'none',
    },
}));

const StyledTitle = styled(Typography)(({theme}) => ({
    mr: 2,
    fontFamily: 'monospace',
    fontWeight: 700,
    letterSpacing: '.3rem',
    textDecoration: 'none',
    color: theme.palette.text.primary,
    [theme.breakpoints.down('sm')]: {
        display: 'none',
    },
}));

const MenuLogo = () => {
    const router = useRouter();

    return (
        <StyledLogo onClick={() => router.push('/')}>
            <Logo width={60} />
            <StyledTitle variant="h6" noWrap>
                MSL
            </StyledTitle>
        </StyledLogo>
    );
};

export default MenuLogo;
