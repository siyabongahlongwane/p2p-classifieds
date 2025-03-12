import { Stack, Typography, Grid2, Box, Checkbox, FormControlLabel, FormGroup, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../stores/store";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import FloatingActionButton from "../../components/FloatingActionButton/FloatingActionButton";
import { useState } from "react";

const ShippingDetails = () => {
    const { cart, checkoutCrumbs, setField, orderObject } = useStore();
    const navigate = useNavigate();
    const [isDelivery, setIsDelivery] = useState(orderObject.shippingMethod === 'Delivery');
    const [isPickUp, setIsPickUp] = useState(orderObject.shippingMethod === 'Pick Up');

    return (
        <Stack position={"relative"}>
            <Breadcrumb crumbs={checkoutCrumbs} activeCrumb={1} fontSize={20} />
            {!cart?.length ? (
                <>
                    <Typography variant="body1" color={"gray"}>
                        Add at least one item to the cart
                    </Typography>
                    <FloatingActionButton title="Go To Shops" action={() => navigate("/home")} />
                </>
            ) : (
                <Grid2 display={"grid"} container gridTemplateColumns={"1fr 1fr"} gap={3}>
                    <Grid2>
                        <Stack display={"flex"} gap={2}>
                            <Box >
                                <Typography fontSize={14} variant="body2" fontWeight={400} color="gray">Shipping Option</Typography>
                                <FormGroup>
                                    <Box display={"flex"} gap={1}>
                                        <FormControlLabel control={<Checkbox size="small" onClick={() => {
                                            setIsDelivery(true);
                                            setIsPickUp(false);
                                            setField('orderObject', { ...orderObject, shippingMethod: 'Delivery', deliveryCost: 60 });

                                        }} checked={isDelivery} />} label={<Typography fontSize={12} >Delivery</Typography>} />
                                        <FormControlLabel control={<Checkbox size="small" onClick={() => {
                                            setIsPickUp(true);
                                            setIsDelivery(false)
                                            setField('orderObject', { ...orderObject, shippingMethod: 'Pick Up', deliveryCost: 0 });
                                        }
                                        } checked={isPickUp} />} label={<Typography fontSize={12} >Pick Up (arranged with seller)</Typography>} />
                                    </Box>
                                </FormGroup>
                                {
                                    isPickUp
                                        ?
                                        <Typography fontSize={12} variant="body2" fontWeight={400} color="red" mt={3}>
                                            You have selected <b>Pick Up</b>, please communicate with the seller and make arrangements.
                                        </Typography>
                                        :
                                        isDelivery
                                            ?
                                            <Stack>
                                                <Stack>
                                                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                                        <InputLabel>Select Your Province</InputLabel>
                                                        <Select
                                                            value={orderObject.province}
                                                            onChange={(e) => setField('orderObject', { ...orderObject, province: e.target.value })}
                                                            label="Province"
                                                        >
                                                            {
                                                                [
                                                                    "Eastern Cape",
                                                                    "Free State",
                                                                    "Gauteng",
                                                                    "KwaZulu-Natal",
                                                                    "Limpopo",
                                                                    "Mpumalanga",
                                                                    "Northern Cape",
                                                                    "North West",
                                                                    "Western Cape"
                                                                ].map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)
                                                            }
                                                        </Select>
                                                    </FormControl>
                                                </Stack>

                                                <Stack>
                                                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                                        <InputLabel>Select Pudo Locker Location</InputLabel>
                                                        <Select
                                                            value={orderObject.pudoLockerLocation}
                                                            onChange={(e) => setField('orderObject', { ...orderObject, pudoLockerLocation: e.target.value })}
                                                            label="Province"
                                                        >
                                                            {
                                                                [
                                                                    "Eastern Cape",
                                                                    "Free State",
                                                                    "Gauteng",
                                                                    "KwaZulu-Natal",
                                                                    "Limpopo",
                                                                    "Mpumalanga",
                                                                    "Northern Cape",
                                                                    "North West",
                                                                    "Western Cape"
                                                                ].map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)
                                                            }
                                                        </Select>
                                                    </FormControl>
                                                </Stack>

                                                <Stack gap={1} mt={1} p={1}>
                                                    <TextField
                                                        error={false}
                                                        placeholder="Enter Phone Number"
                                                        helperText="Ensure this number is correct for notification purposes"
                                                        value={orderObject.phoneNumber}
                                                        onChange={(e) => setField('orderObject', { ...orderObject, phoneNumber: e.target.value })}
                                                    />
                                                </Stack>
                                            </Stack>
                                            : ''
                                }
                            </Box>
                        </Stack>
                    </Grid2>
                    <Grid2>
                        
                    </Grid2>
                </Grid2>
            )}
            {!!cart?.length && <FloatingActionButton title="Make Payment" action={() => navigate("/payment")} />}
        </Stack>
    );
};

export default ShippingDetails;
