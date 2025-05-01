import { useForm } from "react-hook-form";
import {
    Box,
    TextField,
    Button,
    Grid,
    Stack,
} from "@mui/material";
import {  useEffect } from "react";
import { useUserStore } from '../../stores/useUserStore';
import useApi from "../../hooks/useApi";
import useToastStore from "../../stores/useToastStore";
import { User } from "../../typings";

const ProfileSettings = () => {
    const { user, setUser } = useUserStore((state) => state);
    const { put } = useApi(import.meta.env.VITE_API_URL);
    const { showToast } = useToastStore();
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
        },
    });

    const onSubmit = async (data: Partial<User>) => {
        try {
            const updatedProfile = await put(`/auth/update-profile`, { ...data });
            if (!updatedProfile) throw new Error('Error updating profile');

            setUser({ ...updatedProfile });
            localStorage.setItem('user', JSON.stringify(updatedProfile));
            showToast('Profile updated successfully', 'success');

        } catch (error) {
            const _error = error instanceof Error ? error.message : error;
            showToast(_error as string, 'error');
            console.error('error', _error);
            return;
        }
    }

    useEffect(() => {
        const { first_name, last_name, email, phone, } = user as User;

        reset({
            first_name, last_name, email, phone,
        });
    }, [])
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "start",
                minHeight: "100vh"
            }}
        >
            <Stack>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="First Name"
                                    fullWidth
                                    {...register("first_name", { required: "First name is required" })}
                                    error={!!errors.first_name}
                                    helperText={errors.first_name?.message}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Last Name"
                                    fullWidth
                                    {...register("last_name", { required: "Last name is required" })}
                                    error={!!errors.last_name}
                                    helperText={errors.last_name?.message}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Email"
                                    fullWidth
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                            message: "Invalid email address",
                                        },
                                    })}
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Phone Number"
                                    fullWidth
                                    {...register("phone", {
                                        required: "Phone number is required",
                                        pattern: {
                                            value: /^[0-9]{10}$/,
                                            message: "Phone number must be 10 digits",
                                        },
                                    })}
                                    error={!!errors.phone}
                                    helperText={errors.phone?.message}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    <Box sx={{ mt: 3 }}>
                        <Button type="submit" variant="contained" fullWidth>
                            Save Profile Details
                        </Button>
                    </Box>
                </form>
            </Stack>
        </Box>
    );
};

export default ProfileSettings;
