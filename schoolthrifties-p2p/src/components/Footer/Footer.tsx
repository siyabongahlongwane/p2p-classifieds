import { Box, Link, Grid, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useState } from 'react';

const IframeDialog = ({ open, onClose, iframeSrc, title }: any) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {/* Container for responsive iframe */}
          <Box 
            sx={{
              position: 'relative',
              width: '100%',
              height: 0,
              paddingTop: '56.25%', // 16:9 Aspect Ratio (for example)
              overflow: 'hidden',
              borderRadius: '4px', // optional, for rounded corners
            }}
          >
            <iframe
              src={iframeSrc}
              width="100%"
              height="100%"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                border: 0,
              }}
              title="Iframe Content"
              allowFullScreen
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
};

const Footer = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [policy, setPolicy] = useState('');

    const handleOpenDialog = (fileUrl: string) => {
        setPolicy(`/${fileUrl}`);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: '#f4f4f4',
                padding: '10px',
                marginTop: 'auto',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center'
            }}
        >
            {/* Responsive Grid Layout */}
            <Grid container spacing={2} justifyContent="center">
                <Grid item>
                    <Link onClick={() => handleOpenDialog('Terms of Use (School Thirfties).pdf')} underline="hover" sx={{ fontSize: '16px', fontWeight: 500, cursor: 'pointer' }}>
                        Terms of Use
                    </Link>
                </Grid>
                <Grid item>
                    <Link onClick={() => handleOpenDialog('20250303 - Privacy Policy (School Thirfties).pdf')} underline="hover" sx={{ fontSize: '16px', fontWeight: 500, cursor: 'pointer' }}>
                        Privacy Policy
                    </Link>
                </Grid>
                <Grid item>
                    <Link onClick={() => handleOpenDialog('20250303 - PAIA Manual (School Thrifties) (1).pdf')} underline="hover" sx={{ fontSize: '16px', fontWeight: 500, cursor: 'pointer' }}>
                        PAIA Manual
                    </Link>
                </Grid>
            </Grid>
            {/* Iframe Dialog */}
            <IframeDialog
                open={openDialog}
                onClose={handleCloseDialog}
                iframeSrc={policy}
                title="Policy Doc"
            />

        </Box>
    );
};

export default Footer;
