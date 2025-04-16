import { Box, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useStore } from "../../stores/store";
import useApi from "../../hooks/useApi";
import { existsInCart } from "../../utils/product.util";
import { CartItem as ICartItem, User } from "../../typings";
import { AddShoppingCart, Delete, ShoppingCart } from "@mui/icons-material";
import useToastStore from "../../stores/useToastStore";
import LoginPromptModal from "../LoginPromptModal/LoginPromptModal";

export interface CartItemProps {
    product_id: number;
    isButton?: boolean;
    shop_id: number;
    user: User
}

const CartItem = ({ product_id, user, isButton = false, shop_id }: CartItemProps) => {
    const { cart, setCart } = useStore();
    const [isInCart, setIsInCart] = useState(
        existsInCart(product_id, cart.map((p: ICartItem) => p.product_id))
    );

    const { post, remove } = useApi(`${import.meta.env.VITE_API_URL}`);
    const { showToast } = useToastStore();

    const [modalOpen, setModalOpen] = useState(false);

    const handleCloseModal = () => {
        setModalOpen(false); // Close the modal
    };

    const { user_id = null } = user || {};

    useEffect(() => {
        setIsInCart(
            existsInCart(
                product_id,
                cart.map((p: ICartItem) => p.product_id)
            )
        );
    }, [isInCart, cart.length, product_id, cart]);


    const handleCartItem = async () => {
        if (!user_id) {
            setModalOpen(true);
            return;
        }
        if (isInCart) {
            try {
                const likeToRemove = cart.find((p: ICartItem) => p.product_id === product_id)
                    ?.cart_item.cart_item_id;
                const filteredCart = cart.filter((p: ICartItem) => p.product_id !== product_id);
                const removedFromCart = await remove(`/cart/remove-cart-item/${likeToRemove}`);

                if (!removedFromCart) throw new Error('Error removing liked item from cart');
                showToast('Item removed from cart', 'success');
                setCart([...filteredCart]);
                setIsInCart(false);
            } catch (error) {
                const _error = error instanceof Error ? error.message : error;
                showToast(_error as string, 'error');
                console.error('error', _error);
                return;
            }
        } else {
            try {
                console.log(cart, shop_id);
                if (cart.some((product => product.shop_id != shop_id))) {
                    showToast('You can only add items from one shop at a time, clear cart to add new shop items', 'warning', 8000);
                    return;
                }
                const endpoint = `/cart/add-cart-item`;
                const newCart = await post(endpoint, {
                    product_id,
                    user_id: user_id,
                });

                if (!newCart) throw new Error('Error adding item to cart');
                showToast('Item added to cart', 'success');
                setCart([...newCart]);
                setIsInCart(true);
            } catch (error) {
                const _error = error instanceof Error ? error.message : error;
                showToast(_error as string, 'error');
                console.error('error', _error);
                return;
            }
        }
    };

    return (
        <>
            {
                isButton ?
                    <Box
                        onClick={handleCartItem}
                        display={"flex"}
                        gap={0.5}
                        alignItems={"center"}
                        bgcolor={!isInCart ? "var(--blue)" : "#d4d4e0"}
                        color={isInCart ? "#fff" : "#fff"}
                        borderRadius={2}
                        p={0.5}
                        className="pointer"
                    >
                        {!isInCart ? (
                            <ShoppingCart sx={{ ...iconStyles }} />
                        ) : (
                            <Delete sx={{ ...iconStyles }} />
                        )}
                        <Typography
                            fontSize={11}
                            color={isInCart ? "#000" : "#fff"}
                            fontWeight={"400"}
                        >
                            {isInCart ? "Remove from cart" : " Add to cart"}
                        </Typography>
                    </Box>

                    :
                    <Stack direction="column" spacing={1} alignItems="center">
                        {isInCart ? <Delete htmlColor="var(--blue)" onClick={handleCartItem} /> : <AddShoppingCart htmlColor="var(--blue)" onClick={handleCartItem} />}
                        <Typography variant="subtitle2" component="small" fontSize={12} color="gray" fontWeight={300}>{isInCart ? 'Remove from cart' : 'Add to cart'}</Typography>
                    </Stack>

            }
            <LoginPromptModal open={modalOpen} onClose={handleCloseModal} />

        </>

    );
};

export default CartItem;


const iconStyles = {
    fontSize: 14,
    color: "#000",
    backgroundColor: "#fff",
    borderRadius: "50%",
    padding: 0.3,
};
