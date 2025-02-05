'use client';
import Typography from '@mui/material/Typography';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import {Link} from '../../i18n/routing';

const NoScriptContainer = styled(Box)(({theme}) => ({
    margin: theme.spacing(3, 0),
    padding: theme.spacing(2),
    textAlign: 'center',
}));

const AlertBox = styled(Box)(({theme}) => ({
    color: theme.palette.error.main,
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.error.light}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
}));

const NoScriptMessage = () => (
    <noscript>
        <NoScriptContainer>
            <AlertBox>
                <Typography variant="h6" component="span" fontWeight="bold">
                    Please note!
                </Typography>
                <Typography variant="body1" component="span" display="block" mt={1}>
                    It looks like JavaScript is not supported by your browser. This
                    is most likely because you are using an outdated browser or your
                    browser has disabled it for this website. Many crucial functions
                    of this website rely on JavaScript to work properly.{' '}
                    <Link
                        href="https://www.enable-javascript.com/"
                        color="primary"
                        rel="nofollow"
                    >
                        Click here
                    </Link>{' '}
                    to learn how to enable JavaScript for this website.
                </Typography>
            </AlertBox>
        </NoScriptContainer>
    </noscript>
);

export default NoScriptMessage;
