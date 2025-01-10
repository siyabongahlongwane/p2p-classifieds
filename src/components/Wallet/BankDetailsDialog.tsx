import React, { useEffect } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import { Controller, useForm } from "react-hook-form";
import { IBankingDetails } from "../../typings/Banking.int";
import useToastStore from "../../stores/useToastStore";
import useApi from "../../hooks/useApi";


const BankDetailsDialog = ({ setDialogOpen, handleRequestPayout, dialogOpen, user_id }: { setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>, handleRequestPayout: (formState: IBankingDetails) => Promise<void>, dialogOpen: boolean, user_id: number }) => {
    const { register, handleSubmit, formState: { errors, }, reset, control } = useForm({
        defaultValues: {
            name: "",
            account_number: "",
            account_holder: "",
            account_type: "",
        },
    });

    const { get } = useApi(import.meta.env.VITE_API_URL);
    const { showToast } = useToastStore();
    const accountTypes: string[] = ['Current / Cheque', 'Savings', 'Business', 'Other'];

    // Handle form submission
    const onSubmit = (data: IBankingDetails) => {
        handleRequestPayout(data);
    };

    useEffect(() => {
        const fetchBankingDetails = async () => {
            try {
                const bankingDetails = await get(`/banking/fetch-banking-details?user_id=${user_id}`);
                if (!bankingDetails) throw new Error('Error fetching Banking Details');

                const { name, account_number, account_holder, account_type } = bankingDetails;

                reset({ name: name ?? '', account_number: account_number ?? '', account_holder, account_type: account_type ?? '' });
            } catch (error) {
                const _error = error instanceof Error ? error.message : error;
                showToast(_error as string, 'error');
                console.error('error', _error);
                return;
            }
        }

        fetchBankingDetails();
    }, [])
    return (
        <div>
            {/* Dialog */}
            <Dialog open={dialogOpen} fullWidth maxWidth="sm">
                <DialogTitle>Enter Bank Details</DialogTitle>
                <DialogContent>
                    {/* Form Fields */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={3}>
                            <Typography component={'small'} fontSize={14} color="red">Kindly ensure these details are correct for payment.</Typography>
                            {/* Form Fields */}
                            <TextField
                                label="Bank Name"
                                fullWidth
                                {...register("name", {
                                    required: "Bank Name is required"
                                })}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <TextField
                                label="Account Number"
                                fullWidth
                                {...register("account_number", {
                                    required: "Account Numbe is required"
                                })}
                                error={!!errors.account_number}
                                helperText={errors.account_number?.message}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <TextField
                                label="Account Holder"
                                fullWidth
                                {...register("account_holder", {
                                    required: "Account Holder is required"
                                })}
                                error={!!errors.account_holder}
                                helperText={errors.account_holder?.message}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="account-type">Account Type</InputLabel>
                                <Controller
                                    name="account_type"
                                    control={control}
                                    rules={{ required: 'Account Type is required' }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            labelId="account-type-label"
                                            label="Account Type"
                                            error={!!errors.account_type}
                                        >
                                            {
                                                accountTypes.map((accountType, index) => <MenuItem key={index} value={accountType}>{accountType}</MenuItem>)
                                            }
                                        </Select>
                                    )}
                                />
                                <FormHelperText>{errors.account_type?.message}</FormHelperText>
                            </FormControl>
                        </Stack>
                    </form>
                </DialogContent>
                <DialogActions sx={{ mr: 2, pb: 2 }}>
                    {/* Cancel Button */}
                    <Button onClick={() => setDialogOpen(!dialogOpen)} variant="contained" color="error">
                        Cancel
                    </Button>
                    {/* Submit Button */}
                    <Button onClick={handleSubmit(onSubmit)} color="primary" variant="contained">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default BankDetailsDialog;
