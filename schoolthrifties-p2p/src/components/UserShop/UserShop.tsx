import { Stack } from "@mui/material";
import ProductItemGroup from "../../components/Products/ProductItemGroup";
import useApi from "../../hooks/useApi";
import useToastStore from "../../stores/useToastStore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UserShop = () => {
    const {
        get
    } = useApi(`${import.meta.env.VITE_API_URL}`);

    const { showToast } = useToastStore();
    const [shop, setShop] = useState([]);
    const { shop_link } = useParams();

    useEffect(() => {
        const fetchShop = async () => {
            try {
                const shop = await get(`/shop/fetch-shops?link=${shop_link}&mustHaveProducts=true`);
                if (!shop) throw new Error('Error fetching Shop');

                setShop(shop);
            } catch (error) {
                const _error = error instanceof Error ? error.message : error;
                showToast(_error as string, 'error');
                console.error('error', _error);
                return;
            }
        }

        fetchShop();
    }, [shop_link]);

    return (
        <Stack display={"grid"} height={"100%"} rowGap={2}>
            {shop.map((shop, index) => (
                <ProductItemGroup shop={shop} key={index} />
            ))}
        </Stack>
    );
};

export default UserShop;
