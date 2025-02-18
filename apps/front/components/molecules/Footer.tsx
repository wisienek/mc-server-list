'use client';
import Typography from '@mui/material/Typography';
import {styled} from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import {useTranslations} from 'next-intl';

const Container = styled(Grid)(({theme}) => ({
    padding: theme.spacing(3),
    background: theme.palette.background.paper,
    width: '100%',
    marginTop: 'auto',
}));

const Footer = () => {
    const t = useTranslations('footer');

    return (
        <Container as="footer">
            <Typography variant="body2" color="text.primary" noWrap>
                {t.rich('credits', {
                    author: (bits) => (
                        <a
                            rel="noopener noreferrer"
                            href="https://github.com/wisienek"
                            target="_blank"
                        >
                            {bits}
                        </a>
                    ),
                })}
            </Typography>
        </Container>
    );
};

export default Footer;
