import React, { useState } from 'react';
import {
    Autocomplete,
    TextField,
    Box,
    Typography,
    Paper
} from '@mui/material';

const locations = [
    {
        code: 'CG70',
        name: 'Cradlestone Mall',
        address: 'Cradlestone Mall, Hendrik Potgieter Rd, Diswilmar AH, Krugersdorp, 1739'
    },
    {
        code: 'CG01',
        name: 'Willowrock Value Centre',
        address: 'Solomon Mahlangu Drive & Bendeman Blvd, Equistria, Pretoria, 0184'
    }
    // You can extract more details or import the full objects if needed
];

export default function LockerSelection() {
    const [selectedLocation, setSelectedLocation] = useState(null);

    return (
        <Box width="100%" maxWidth={600} mx="auto">
            <Autocomplete
                fullWidth
                options={locations}
                getOptionLabel={(option) =>
                    `${option.name} (${option.code})`
                }
                filterOptions={(options, { inputValue }) =>
                    options.filter(
                        (option) =>
                            option.name.toLowerCase().includes(inputValue.toLowerCase()) ||
                            option.code.toLowerCase().includes(inputValue.toLowerCase()) ||
                            option.address.toLowerCase().includes(inputValue.toLowerCase())
                    )
                }
                onChange={(_, newValue) => setSelectedLocation(newValue)}
                renderInput={(params) => (
                    <TextField {...params} label="Select Location" variant="outlined" />
                )}
                renderOption={(props, option) => (
                    <Box component="li" {...props}>
                        <Box>
                            <Typography fontWeight={500}>{option.name}</Typography>
                            <Typography fontSize={12} color="text.secondary">
                                {option.address}
                            </Typography>
                        </Box>
                    </Box>
                )}
            />

            {selectedLocation && (
                <Paper sx={{ mt: 2, p: 2 }}>
                    <Typography variant="h6">Selected Location:</Typography>
                    <Typography><strong>Name:</strong> {selectedLocation.name}</Typography>
                    <Typography><strong>Code:</strong> {selectedLocation.code}</Typography>
                    <Typography><strong>Address:</strong> {selectedLocation.address}</Typography>
                </Paper>
            )}
        </Box>
    );
}
