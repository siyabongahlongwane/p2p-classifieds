import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
} from "@mui/material";
import useToastStore from "../../stores/useToastStore";

export type BankingDetails = { bank_name: string; account_number: string; account_holder: string; }
const BankDetailsDialog = ({ setDialogOpen, handleRequestPayout, dialogOpen }: { setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>, handleRequestPayout: (formState: BankingDetails) => Promise<void>, dialogOpen: boolean }) => {
    const [formState, setFormState] = useState({
        bank_name: "",
        account_number: "",
        account_holder: "",
    });

    const { showToast } = useToastStore();

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState({
            ...formState,
            [name]: value,
        });
    };

    // Handle form submission
    const handleSubmit = () => {
        if (Object.values(formState).filter(Boolean).length < 3) {
            showToast('Please fill in all fields', 'warning');
            return;
        }
        handleRequestPayout(formState);
    };

    return (
        <div>
            {/* Dialog */}
            <Dialog open={dialogOpen} fullWidth maxWidth="sm">
                <DialogTitle>Enter Bank Details</DialogTitle>
                <DialogContent>
                <Typography component={'small'} fontSize={14} color="red">Kindly ensure these details are correct. This action is irreversible.</Typography>
                    {/* Form Fields */}
                    <TextField
                        label="Bank Name"
                        name="bank_name"
                        value={formState.bank_name}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Account Number"
                        name="account_number"
                        value={formState.account_number}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Account Holder"
                        name="account_holder"
                        value={formState.account_holder}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions sx={{ mr: 2, pb: 2 }}>
                    {/* Cancel Button */}
                    <Button onClick={() => setDialogOpen(!dialogOpen)} variant="contained" color="error">
                        Cancel
                    </Button>
                    {/* Submit Button */}
                    <Button onClick={handleSubmit} color="primary" variant="contained">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default BankDetailsDialog;
