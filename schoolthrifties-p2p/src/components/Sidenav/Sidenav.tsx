import { Box, Stack, Typography } from '@mui/material';
import Menu from '../Menu/Menu';
import './Sidenav.css';

const Sidenav = () => {
  return (
    <Stack className="sidenav" height={'100%'}>
        <Box className="logo" maxWidth={'200px'}>
            <img width={'100%'} src={'/ST LOGO HORIZONTAL BLACK NO BG.png'} alt="School Thrifties Logo" />
        </Box>
        <Menu />
        <Typography color='gray' fontSize={12} align="center" mt={'auto'} pb={2}>
            <span className="version">v{import.meta.env.VITE_APP_VERSION}</span>
        </Typography>
    </Stack>

  )
}

export default Sidenav