import { Controller, useForm } from "react-hook-form";
import {
    Box,
    TextField,
    Button,
    Stack,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import { useContext, useEffect } from "react";
import { UserContext } from "../../context/User/UserContext";
import useApi from "../../hooks/useApi";
import useToastStore from "../../stores/useToastStore";
import { IBankingDetails } from "../../typings/Banking.int";

const BankingDetailsSettings = () => {
    const { user } = useContext(UserContext);
    const { put, get } = useApi(import.meta.env.VITE_API_URL);
    const { showToast } = useToastStore();
    const { register, handleSubmit, formState: { errors }, reset, control } = useForm({
        defaultValues: {
            name: "",
            account_number: "",
            account_holder: "",
            account_type: "",
        },
    });
    const accountTypes: string[] = ['Current / Cheque', 'Savings', 'Business', 'Other'];

    const onSubmit = async (data: IBankingDetails) => {
        try {
            const updatedBankingDetails = await put(`/banking/update-banking-details/${user.user_id}`, { ...data });
            if (!updatedBankingDetails) throw new Error('Error updating Banking Details');

            const { name, account_number, account_holder, account_type } = updatedBankingDetails;
            reset({ name, account_number, account_holder, account_type });

            showToast('Banking Details updated successfully', 'success');

        } catch (error) {
            const _error = error instanceof Error ? error.message : error;
            showToast(_error as string, 'error');
            console.error('error', _error);
            return;
        }
    }

    useEffect(() => {
        const fetchBankingDetails = async () => {
            try {
                const bankingDetails = await get(`/banking/fetch-banking-details?user_id=${user.user_id}`);
                if (bankingDetails) {
                    const { name, account_number, account_holder, account_type } = bankingDetails;


                    reset({ name, account_number, account_holder, account_type });
                }
            } catch (error) {
                console.error(error);
            }
        }

        fetchBankingDetails();
    }, [])



    return (

        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
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
                <Box sx={{ mt: 3 }}>
                    <Button type="submit" variant="contained" fullWidth>
                        Save Banking Details
                    </Button>
                </Box>
            </Stack>
        </form>
    );
}


export default BankingDetailsSettings;
