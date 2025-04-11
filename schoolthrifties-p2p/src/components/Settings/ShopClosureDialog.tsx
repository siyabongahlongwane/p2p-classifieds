import {
    TextField,
    Button,
    Stack,
    Typography,
    Paper,
    Switch,
    FormControlLabel,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import useApi from '../../hooks/useApi';
import useToastStore from '../../stores/useToastStore';
import { useUserStore } from '../../stores/useUserStore';

export interface ShopClosureFormData {
    start_date: string;
    end_date: string;
    reason?: string;
    is_active: boolean;
}

export default function ShopClosureForm() {
    const [initialData, setInitialData] = useState<ShopClosureFormData | null>(null);
    const [isActive, setIsActive] = useState(initialData?.is_active ?? false);
    const { put, get } = useApi(import.meta.env.VITE_API_URL);
    const { showToast } = useToastStore();
    const { user } = useUserStore((state) => state);
    const onSubmit = async (data: ShopClosureFormData) => {
        try {
            const updatedShopClosure = await put(`/shop/update-shop-closure/${user?.shop_id}`, { ...data });
            if (!updatedShopClosure) throw new Error(updatedShopClosure?.err || 'Error updating Shop Closure');

            const { start_date, end_date, is_active, reason } = updatedShopClosure;
            reset({ start_date, end_date, is_active, reason });
            setIsActive(is_active);

            setInitialData(updatedShopClosure);

            showToast(updatedShopClosure?.msg || 'Away date updated successfully', 'success');

        } catch (error) {
            const _error = error instanceof Error ? error.message : error;
            showToast(_error as string, 'error');
            console.error('error', _error);
            return;
        }
    }

    useEffect(() => {
        const fetchShopClosure = async () => {
            try {
                const shopClosure = await get(`/shop/fetch-shop-closure/${user?.shop_id}`);
                if (!shopClosure) throw new Error(shopClosure?.msg || 'Error fetching Shop Closure');

                const { start_date, end_date, is_active, reason } = shopClosure;
                reset({ start_date, end_date, is_active, reason });
                setIsActive(is_active);
            } catch (error) {
                const _error = error instanceof Error ? error.message : error;
                showToast(_error as string, 'error');
                console.error('error', _error);
                return;
            }
        }

        fetchShopClosure();
    }, [])

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<ShopClosureFormData>({
        defaultValues: {
            start_date: initialData?.start_date || '',
            end_date: initialData?.end_date || '',
            reason: initialData?.reason || '',
            is_active: initialData?.is_active || false
        },
    });

    const handleValidSubmit = (data: ShopClosureFormData) => {
        if (isActive && new Date(data.end_date) < new Date(data.start_date)) {
            showToast('End date cannot be before start date', 'error');
            return;
        }

        onSubmit({ ...data, is_active: isActive });
        reset();
    };

    return (
        <>
            <Typography variant="h6" mb={2} fontSize={14} color='gray'>
                Update this to alert buyers you are not available to process orders in that period
            </Typography>


            <form onSubmit={handleSubmit(handleValidSubmit)}>
                <Stack spacing={2}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                            />
                        }
                        label="Enable Away Date"
                        sx={{ mb: 2 }}
                    />
                    <Controller
                        name="start_date"
                        control={control}
                        rules={{ required: isActive ? 'Start date is required' : false }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Start Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                error={!!errors.start_date}
                                helperText={errors.start_date?.message}
                                fullWidth
                                disabled={!isActive}
                            />
                        )}
                    />
                    <Controller
                        name="end_date"
                        control={control}
                        rules={{ required: isActive ? 'End date is required' : false }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="End Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                error={!!errors.end_date}
                                helperText={errors.end_date?.message}
                                fullWidth
                                disabled={!isActive}
                            />
                        )}
                    />
                    <Controller
                        name="reason"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Reason (optional)"
                                fullWidth
                                multiline
                                rows={2}
                                disabled={!isActive}
                            />
                        )}
                    />
                    <Button type="submit" variant="contained">
                        Update Away Date
                    </Button>
                </Stack>
            </form>
        </>
    );
}
