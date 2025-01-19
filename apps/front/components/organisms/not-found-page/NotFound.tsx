'use client';
import ChevronLeft from '@mui/icons-material/ChevronLeft';

import {Container, Section, StyledButton, StyledLink, Title, Text} from './styles';

const NotFoundPage = () => {
    return (
        <Container>
            <Section>
                <Title>Not Found</Title>
                <Text>
                    The page that you requested could not be found, please check the
                    address and try again.
                </Text>
                <StyledLink href="/">
                    <StyledButton variant="contained" color="primary">
                        <ChevronLeft width="24" height="24" />
                        <span>Return Home</span>
                    </StyledButton>
                </StyledLink>
            </Section>
        </Container>
    );
};
export default NotFoundPage;
