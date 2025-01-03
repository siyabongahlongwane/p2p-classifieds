import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import useToastStore from '../../stores/useToastStore';
import { SyntheticEvent } from 'react';

const Toast = () => {
    const { isOpen, message, severity, hideToast } = useToastStore();

    const handleClose = (_event: SyntheticEvent | Event, reason: SnackbarCloseReason) => {
        if (reason === 'clickaway') return;
        hideToast();
    };

    return (
        <Snackbar
            open={isOpen}
            autoHideDuration={4000}
            onClose={(e) => handleClose(e, 'timeout')}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert onClose={(e) => handleClose(e, 'escapeKeyDown')} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default Toast;
