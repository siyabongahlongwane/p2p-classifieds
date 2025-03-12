import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    const handleBackToHome = () => {
        navigate('/home');
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                textAlign: 'center',
                padding: 2,
            }}
        >
            <Typography
                variant="h1"
                sx={{
                    fontSize: { xs: '4rem', md: '6rem' },
                    fontWeight: 'bold',
                    color: 'primary.main',
                }}
            >
                404
            </Typography>
            <Typography
                variant="h6"
                sx={{
                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                    color: 'text.secondary',
                    marginBottom: 3,
                }}
            >
                Oops! The page you're looking for doesn't exist.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={handleBackToHome}
                sx={{ paddingX: 3, paddingY: 1.5, fontSize: '1rem' }}
            >
                Back to Home
            </Button>
        </Box>
    );
};

export default NotFound;
