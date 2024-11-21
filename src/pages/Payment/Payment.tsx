import { Stack, Typography, Grid2, Box, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../stores/store";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import FloatingActionButton from "../../components/FloatingActionButton/FloatingActionButton";
import OrderSummary from "../../components/OrderSummary/OrderSummary";

const Payment = () => {
    const { cart, checkoutCrumbs } = useStore();
    const navigate = useNavigate();
    return (
        <Stack position={"relative"}>
            <Breadcrumb crumbs={checkoutCrumbs} activeCrumb={2} fontSize={20} />
            {!cart?.length ? (
                <>
                    <Typography variant="body1" color={"gray"}>
                        Add at least one item to the cart
                    </Typography>
                    <FloatingActionButton title="Go To Shops" action={() => navigate("/home")} />
                </>
            ) : (
                <Grid2 display={"grid"} container gridTemplateColumns={"2fr 1fr"} gap={3}>
                    <Stack gap={3}>
                        {[...cart].map((product, index: number) => (
                            <Paper>
                                <Stack flexDirection={'row'} key={index} width={"100%"} alignItems={'center'} gap={2} p={2}>
                                    <img height={100} src={product.photos[0]['photo_url']} alt={product.title} />
                                    <Box>
                                        <Typography variant="body1" color={"gray"}> 1 x {product.title}</Typography>
                                        <Typography variant="body1" > R {product.price}</Typography>
                                    </Box>
                                </Stack>
                            </Paper>
                        ))}
                    </Stack>
                    <Grid2>
                        <OrderSummary />
                    </Grid2>
                </Grid2>
            )}
            {!!cart?.length && <FloatingActionButton title="Make Payment" action={() => navigate("/payment")} />}
        </Stack>
    );
};

export default Payment;
