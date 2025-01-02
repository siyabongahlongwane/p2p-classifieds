import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import useLoaderStore from '../../stores/useLoaderStore';


const Loader = () => {
    const { loading, message }: { loading: boolean, message?: string } = useLoaderStore();

    if (!loading) return null; // Do not render if not loading

    return (
        <Box
            position="fixed"
            top={0}
            left={0}
            width="100%"
            height="100%"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            bgcolor="rgba(0, 0, 0, 0.5)"
            zIndex={9999}
        >
            <CircularProgress size={60} style={{ color: '#016ec0' }} />
            {message && <p style={{ color: '#fff', marginTop: 10 }}>Loading</p>}
        </Box>
    );
};

export default Loader;
