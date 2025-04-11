import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';
import { AccountCircle } from '@mui/icons-material'; // Import Material-UI icons
import { useNavigate } from 'react-router-dom';

const LoginPromptModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    
    const navigate = useNavigate();
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Login Required</DialogTitle>
            <DialogContent>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <AccountCircle style={{ fontSize: 40, color: 'var(--blue)' }} />
                    <Typography variant="body1">
                        You need to log in before performing this action. Please log in to continue.
                    </Typography>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => navigate('/sign-in')} color="primary" variant="contained">
                    Log In
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LoginPromptModal;
