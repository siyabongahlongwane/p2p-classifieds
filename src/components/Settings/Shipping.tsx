import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
    Box,
    Typography,
    TextField,
    Paper,
    Button,
    FormControlLabel,
    Switch,
} from "@mui/material";

const ShippingSettings = ({ shopId }) => {
    const { control, handleSubmit, setValue, watch } = useForm({
        defaultValues: {
            pickUp: { enabled: false, price: "", description: "Customer Picks Up From Seller" },
            pudo: { enabled: false, price: "", description: "Delivery Option Using PUDO" },
            aramex: { enabled: false, price: "", description: "Delivery Option Using Aramex" },
        },
    });

    const watchFields = watch();

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.get(`/api/shipping-settings/${shopId}`);
                const { pickUp, pudo, aramex } = response.data;
                setValue("pickUp", pickUp);
                setValue("pudo", pudo);
                setValue("aramex", aramex);
            } catch (error) {
                console.error("Failed to fetch shipping settings:", error);
            }
        };

        // fetchSettings();
    }, [shopId, setValue]);

    const onSubmit = async (data) => {
        try {
            //   await axios.post(`/api/shipping-settings/${shopId}`, data);
            //   alert("Shipping settings updated successfully!");
            console.log(data);

        } catch (error) {
            //   console.error("Failed to save shipping settings:", error);
            alert("Failed to update shipping settings.");
        }
    };

    const renderShippingMethod = (name, label) => (
        <Box key={name} sx={{ mb: 3 }}>
            <Controller
                name={`${name}.enabled`}
                control={control}
                render={({ field }) => (
                    <FormControlLabel
                        control={<Switch {...field} checked={field.value} />}
                        label={label}
                    />
                )}
            />
            {watchFields[name]?.enabled && (
                <Box sx={{ pl: 4 }}>
                    <Controller
                        name={`${name}.price`}
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="number"
                                label="Price"
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                        )}
                    />
                    {/* <Controller
            name={`${name}.description`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                fullWidth
                multiline
                disabled
                rows={3}
              />
            )}
          /> */}
                </Box>
            )}
        </Box>
    );

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                {renderShippingMethod("pickUp", "Pick Up")}
                {renderShippingMethod("pudo", "Pudo")}
                {renderShippingMethod("aramex", "Aramex")}
                <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
                    Save Settings
                </Button>
            </form>
        </>
    );
};

export default ShippingSettings;
