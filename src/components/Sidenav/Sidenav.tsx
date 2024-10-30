import { Box, Stack } from '@mui/material';
import Menu from '../Menu/Menu';
import './Sidenav.css';

const Sidenav = () => {
  return (
    <Stack className="sidenav" height={'100%'}>
        <Box className="logo" maxWidth={'200px'}>
            <img width={'100%'} src={'/logo-v2.png'} alt="School Thrifties Logo" />
        </Box>
        <Menu />
    </Stack>

  )
}

export default Sidenav