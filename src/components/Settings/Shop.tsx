import { useForm } from "react-hook-form";
import {
    Box,
    TextField,
    Button,
    Stack,
} from "@mui/material";
import { useContext, useEffect } from "react";
import useApi from "../../hooks/useApi";
import useToastStore from "../../stores/useToastStore";
import { UserContext } from "../../context/User/UserContext";

const ShopSettings = () => {
    const { put, get } = useApi(import.meta.env.VITE_API_URL);
    const { showToast } = useToastStore()
    const { user } = useContext(UserContext);
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            name: "",
            link: "",
            location: ""
        },
    });

    const onSubmit = async (data: { name: string, link: string, location: string }) => {
        console.log("Updated Data:", data);

        try {
            const shopDetails = await put(`/shop/update-shop/${user.user_id}`, { ...data });
            if (!shopDetails) throw new Error('Error updating Shop Details');

            const { name, link, location } = shopDetails;
            reset({ name, link, location });

            showToast('Shop Details updated successfully', 'success');
        } catch (error) {
            const _error = error instanceof Error ? error.message : error;
            showToast(_error as string, 'error');
            console.error('error', _error);
            return;
        }
    };

    useEffect(() => {
        const fetchShopDetails = async () => {
            try {
                const [shopDetails] = await get(`/shop/fetch-shops?user_id=${user.user_id}`);
                if (shopDetails) {
                    const { name, link, location } = shopDetails;

                    reset({ name, link, location });
                }
            } catch (error) {
                console.error(error);
            }
        }

        fetchShopDetails();
    }, [user]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} >
            <Stack spacing={3}>
                {/* Form Fields */}
                <TextField
                    label="Shop Name"
                    fullWidth
                    {...register("name", {
                        required: "Shop Name is required"
                    })}
                    error={!!errors.name}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    helperText={errors.name?.message}
                />
                <TextField
                    label="Shop Link"
                    fullWidth
                    {...register("link", {
                        required: "Shop Link is required"
                    })}
                    error={!!errors.link}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    helperText={errors.link?.message}
                />
                <TextField
                    label="Shop Location"
                    fullWidth
                    {...register("location", {
                        required: "Shop Location is required",
                    })}
                    placeholder="E.g Pretoria, Gauteng"
                    error={!!errors.location}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    helperText={errors.location?.message}
                />
                <Box sx={{ mt: 3 }}>
                    <Button type="submit" variant="contained" fullWidth>
                        Save Shop Details
                    </Button>
                </Box>
            </Stack>
        </form>
    );
};

export default ShopSettings;
