'use client';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import {styled} from '@mui/material/styles';
import {useTranslations} from 'next-intl';
import {Link} from '../../i18n/routing';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const Container = styled(Box)(({theme}) => ({
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: theme.spacing(2),
}));

const Section = styled(Box)(({theme}) => ({
    textAlign: 'center',
    marginTop: theme.spacing(4),
}));

const Title = styled(Typography)(({theme}) => ({
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: theme.spacing(2),
    color: theme.palette.text.primary,
}));

const Text = styled(Typography)(({theme}) => ({
    marginTop: theme.spacing(1),
    fontSize: '1.25rem',
    color: theme.palette.text.secondary,
}));

const StyledLink = styled(Link)(({theme}) => ({
    textDecoration: 'none',
    marginTop: theme.spacing(5),
    display: 'inline-block',
}));

const StyledButton = styled(Button)(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1, 2),
}));

const NotFoundPage = () => {
    const t = useTranslations('page.not-found');

    return (
        <Container>
            <Section>
                <Title>{t('title')}</Title>
                <Text>{t('description')}</Text>
                <StyledLink href="/">
                    <StyledButton variant="contained" color="primary">
                        <ChevronLeft width="24" height="24" />
                        <span>{t('return')}</span>
                    </StyledButton>
                </StyledLink>
            </Section>
        </Container>
    );
};
export default NotFoundPage;
