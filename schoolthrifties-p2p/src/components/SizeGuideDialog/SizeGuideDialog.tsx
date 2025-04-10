import {
    Dialog, DialogTitle, DialogContent, IconButton, Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    useMediaQuery, useTheme, Box, Tabs, Tab
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';

interface SizeGuideDialogProps {
    open: boolean;
    onClose: () => void;
}

const clothingSizes = [
    { age: '0 - 3 M', height: '50 - 62', chest: '40 - 43', waist: '41 - 43', hips: '41 - 43', size: '0 - 3M' },
    { age: '3 - 6 M', height: '62 - 68', chest: '43 - 45', waist: '43 - 45', hips: '43 - 46', size: '3 - 6M' },
    { age: '6 - 12 M', height: '68 - 76', chest: '45 - 48', waist: '45 - 47', hips: '46 - 49', size: '6 - 12M' },
    { age: '12 - 18 M', height: '76 - 83', chest: '48 - 50', waist: '47 - 49', hips: '49 - 51', size: '12 - 18M' },
    { age: '18 - 24 M', height: '83 - 90', chest: '50 - 52', waist: '49 - 50', hips: '51 - 53', size: '18 - 24M' },
    { age: '2 - 3 Y', height: '90 - 98', chest: '52 - 54', waist: '50 - 52', hips: '53 - 56', size: '2 - 3' },
    { age: '3 - 4 Y', height: '98 - 104', chest: '54 - 56', waist: '52 - 53', hips: '56 - 60', size: '3 - 4' },
    { age: '4 - 5 Y', height: '104 - 110', chest: '56 - 58', waist: '53 - 54', hips: '60 - 62', size: '4 - 5' },
    { age: '5 - 6 Y', height: '110 - 116', chest: '58 - 60', waist: '54 - 55', hips: '62 - 64', size: '5 - 6' },
    { age: '6 - 7 Y', height: '116 - 122', chest: '60 - 62', waist: '55 - 57', hips: '64 - 66', size: '6 - 7' },
    { age: '7 - 8 Y', height: '122 - 128', chest: '62 - 64', waist: '57 - 59', hips: '66 - 69', size: '7 - 8' },
    { age: '8 - 9 Y', height: '128 - 134', chest: '64 - 67', waist: '59 - 61', hips: '69 - 72', size: '8 - 9' },
    { age: '9 - 10 Y', height: '134 - 140', chest: '67 - 70', waist: '61 - 63', hips: '72 - 75', size: '9 - 10' },
    { age: '10 - 12 Y', height: '140 - 152', chest: '70 - 78', waist: '63 - 67', hips: '75 - 82', size: '10 - 12' },
    { age: '12 - 14 Y', height: '152 - 164', chest: '78 - 85', waist: '67 - 72', hips: '82 - 88', size: '12 - 14' },
    { age: '14 - 16 Y', height: '164 - 174', chest: '85 - 92', waist: '72 - 77', hips: '88 - 94', size: '14 - 16' },
    { age: '16 - 18 Y', height: '174 - 180', chest: '92 - 98', waist: '77 - 82', hips: '94 - 100', size: '16 - 18' },
];

const shoeSizes = [
    { uk: '0', eu: '16', length: '76-84 mm', age: '0-3 months' },
    { uk: '1', eu: '17', length: '85-92 mm', age: '3-6 months' },
    { uk: '2', eu: '18', length: '93-100 mm', age: '6-9 months' },
    { uk: '3', eu: '19', length: '101-109 mm', age: '9-12 months' },
    { uk: '4', eu: '20', length: '110-118 mm', age: '12-18 months' },
    { uk: '5', eu: '21-22', length: '119-126 mm', age: '18-24 months' },
    { uk: '6', eu: '23', length: '127-135 mm', age: '2 years' },
    { uk: '7', eu: '24', length: '136-144 mm', age: '2-2.5 years' },
    { uk: '8', eu: '25', length: '145-152 mm', age: '2.5-3 years' },
    { uk: '9', eu: '27', length: '153-161 mm', age: '3-4 years' },
    { uk: '10', eu: '28', length: '162-169 mm', age: '4-5 years' },
    { uk: '11', eu: '29', length: '170-178 mm', age: '5-6 years' },
    { uk: '12', eu: '30', length: '179-186 mm', age: '6-7 years' },
    { uk: '13', eu: '31', length: '187-195 mm', age: '7-8 years' },
    { uk: '1', eu: '32', length: '196-203 mm', age: '8-9 years' },
    { uk: '2', eu: '33', length: '204-212 mm', age: '9-10 years' },
    { uk: '3', eu: '34', length: '213-220 mm', age: '10-11 years' },
    { uk: '4', eu: '36', length: '221-229 mm', age: '11-12 years' },
    { uk: '5', eu: '37', length: '230-237 mm', age: '12-13 years' },
    { uk: '6', eu: '39', length: '238-246 mm', age: '13-14 years' },
    { uk: '7', eu: '40', length: '247-254 mm', age: '14-15 years' },
    { uk: '8', eu: '42', length: '255-262 mm', age: '15-16 years' },
    { uk: '9', eu: '43', length: '263-270 mm', age: '16-17 years' },
    { uk: '10', eu: '44', length: '271-278 mm', age: '17-18 years' },
];


const SizeGuideDialog: React.FC<SizeGuideDialogProps> = ({ open, onClose }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [tabIndex, setTabIndex] = React.useState(0);

    return (
        <Dialog open={open} onClose={onClose} fullScreen={fullScreen} fullWidth maxWidth="md">
            <DialogTitle>
                South African Children's Size Guide
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)} variant="fullWidth">
                    <Tab label="Clothing" />
                    <Tab label="Shoes" />
                </Tabs>

                {tabIndex === 0 && (
                    <Box mt={2}>
                        <Typography variant="subtitle1" gutterBottom>Children's Clothing Size Guide</Typography>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Age</TableCell>
                                        <TableCell>Height</TableCell>
                                        <TableCell>Chest</TableCell>
                                        <TableCell>Waist</TableCell>
                                        <TableCell>Hips</TableCell>
                                        <TableCell>Size</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {clothingSizes.map((row, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{row.age}</TableCell>
                                            <TableCell>{row.height}</TableCell>
                                            <TableCell>{row.chest}</TableCell>
                                            <TableCell>{row.waist}</TableCell>
                                            <TableCell>{row.hips}</TableCell>
                                            <TableCell>{row.size}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box mt={3}>
                            <Typography variant="h6">How to Measure</Typography>
                            <ul>
                                <li><strong>Height:</strong> Measure from the top of the head to the floor.</li>
                                <li><strong>Chest:</strong> Measure around the fullest part of the chest.</li>
                                <li><strong>Waist:</strong> Measure around the natural waistline.</li>
                                <li><strong>Hips:</strong> Measure around the widest part of the hips.</li>
                            </ul>
                        </Box>
                    </Box>
                )}

                {tabIndex === 1 && (
                    <Box mt={2}>
                        <Typography variant="subtitle1" gutterBottom>Children's Shoe Size Guide</Typography>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>UK Size</TableCell>
                                        <TableCell>EU Size</TableCell>
                                        <TableCell>Foot Length</TableCell>
                                        <TableCell>Approx. Age</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {shoeSizes.map((row, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{row.uk}</TableCell>
                                            <TableCell>{row.eu}</TableCell>
                                            <TableCell>{row.length}</TableCell>
                                            <TableCell>{row.age}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box mt={3}>
                            <Typography variant="h6">How to Measure</Typography>
                            <ul>
                                <li>Place the child's foot on a piece of paper, mark the longest toe and heel, then measure the length in cm.</li>
                                <li>Match the measurement with the shoe size chart above.</li>
                            </ul>
                        </Box>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default SizeGuideDialog;
