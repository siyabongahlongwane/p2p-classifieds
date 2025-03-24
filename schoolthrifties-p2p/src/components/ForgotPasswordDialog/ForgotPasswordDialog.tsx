import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
    Box,
} from '@mui/material';
import useAuth from '../../hooks/useAuth';

interface ForgotPasswordDialogProps {
    open: boolean;
    onClose: () => void;
}

const ForgotPasswordDialog: React.FC<ForgotPasswordDialogProps> = ({
    open,
    onClose
}) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const { forgotPassword } = useAuth();

    const handleSubmit = async () => {
        if (!email) {
            setError('Email is required');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const data = await forgotPassword(email);
            if (data?.resetLink) {
                const { resetLink } = data;
                setSuccessMsg('Redirecting...');
                window.open(resetLink, '_self');
            }

        } catch (err: any) {
            setError(err.message || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setEmail('');
        setError('');
        setSuccessMsg('');
        setLoading(false);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
            <DialogTitle>Forgot Password</DialogTitle>
            <DialogContent>
                {successMsg ? (
                    <Typography color="success.main">{successMsg}</Typography>
                ) : (
                    <>
                        <Typography mb={2}>
                            Enter your email address to reset your password
                        </Typography>
                        <TextField
                            fullWidth
                            type="email"
                            label="Email Address"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={!!error}
                            helperText={error}
                            autoFocus
                        />
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Box mr={2}>
                    <Button onClick={handleClose} disabled={loading}>
                        Close
                    </Button>
                    {!successMsg && (
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Link'}
                        </Button>
                    )}
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default ForgotPasswordDialog;
