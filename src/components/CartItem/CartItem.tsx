import { Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useStore } from "../../stores/store";
import useApi from "../../hooks/useApi";
import { existsInCart } from "../../utils/product.util";
import { CartItem as ICartItem } from "../../typings";
import { AddShoppingCart, Delete } from "@mui/icons-material";

export interface CartItemProps {
    product_id: number;
    user_id: number;
}

const CartItem = ({ product_id, user_id }: CartItemProps) => {
    const { cart, setCart } = useStore();
    const [isInCart, setIsInCart] = useState(
        existsInCart(product_id, cart.map((p: ICartItem) => p.product_id))
    );

    const { post, remove } = useApi(`${import.meta.env.VITE_API_URL}`);


    useEffect(() => {
        setIsInCart(
            existsInCart(
                product_id,
                cart.map((p: ICartItem) => p.product_id)
            )
        );
    }, [isInCart, cart.length, product_id, cart]);


    const handleCartItem = async () => {
        if (isInCart) {
            try {
                const likeToRemove = cart.find((p: ICartItem) => p.product_id === product_id)
                    ?.cart_item.cart_item_id;
                const newCart = cart.filter((p: ICartItem) => p.product_id !== product_id);
                remove(`/cart/remove-cart-item/${likeToRemove}?user_id=${user_id}`).then(
                    () => {
                        setCart([...newCart]);
                        setIsInCart(false);
                    }
                );
            } catch (error) {
                console.error(error);
            }
        } else {
            try {
                const endpoint = `/cart/add-cart-item`;
                const newCart = await post(endpoint, {
                    product_id,
                    user_id: user_id,
                });
                setCart([...newCart]);
                setIsInCart(true);
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <Stack direction="column" spacing={1} alignItems="center">
            {isInCart ? <Delete htmlColor="var(--blue)" onClick={handleCartItem} /> : <AddShoppingCart htmlColor="var(--blue)" onClick={handleCartItem} />}
            <Typography variant="subtitle2" component="small" fontSize={12} color="gray" fontWeight={300}>{isInCart ? 'Remove from cart' : 'Add to cart'}</Typography>
        </Stack>
    );
};

export default CartItem;