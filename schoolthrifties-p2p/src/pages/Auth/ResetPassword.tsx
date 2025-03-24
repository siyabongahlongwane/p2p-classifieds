import {
    Box,
    Button,
    Container,
    IconButton,
    InputAdornment,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import useToastStore from "../../stores/useToastStore";

interface ResetFormValues {
    password: string;
    confirmPassword: string;
}

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { showToast } = useToastStore();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ResetFormValues>();

    const onSubmit = async (data: ResetFormValues) => {
        if (!token) {
            setServerError("Reset token is missing.");
            return;
        }

        setLoading(true);
        setServerError("");

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password: data.password }),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.err || "Password reset failed.");
            }

            showToast(result?.msg || "Password reset successfully.", "success");
            navigate("/sign-in");
        } catch (err: any) {
            setServerError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 10 }}>
                <Typography variant="h5" mb={2} textAlign="center">
                    Reset Your Password
                </Typography>

                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Stack spacing={2}>
                        <TextField
                            type={showPassword ? "text" : "password"}
                            label="New Password"
                            fullWidth
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters",
                                },
                            })}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            type={showConfirmPassword ? "text" : "password"}
                            label="Confirm Password"
                            fullWidth
                            {...register("confirmPassword", {
                                required: "Please confirm your password",
                                validate: (value) =>
                                    value === watch("password") || "Passwords do not match",
                            })}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword?.message}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {serverError && (
                            <Typography color="error" fontSize={14}>
                                {serverError}
                            </Typography>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            fullWidth
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </Button>
                    </Stack>
                </Box>
            </Paper>
        </Container>
    );
};

export default ResetPasswordPage;
