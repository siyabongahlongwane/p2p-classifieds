import { useEffect, useState } from "react";
import { Favorite, FavoriteBorderOutlined } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import { useStore } from "../../stores/store";
import { isLiked } from "../../utils/product.util";
import useApi from "../../hooks/useApi";
import { ProductWithLike } from "../../typings";
import useToastStore from "../../stores/useToastStore";

interface LikeItemProps {
    user_id: number;
    product_id: number;
    isButton?: boolean;
}

const LikeItem = ({ user_id, product_id, isButton }: LikeItemProps) => {
    const { likes, setLikes } = useStore();
    const [liked, setIsLiked] = useState(false);
    const { post, remove } = useApi(`${import.meta.env.VITE_API_URL}`);
    const { showToast } = useToastStore();

    useEffect(() => {
        setIsLiked(
            isLiked(
                product_id,
                likes.map((p: ProductWithLike) => p.product_id)
            )
        );
    }, [likes, product_id]);

    const handleLike = async () => {
        if (liked) {
            try {
                const likeToRemove = likes.find((p: ProductWithLike) => p.product_id === product_id)
                    ?.like_item?.like_id;
                const newLikes = likes.filter((p: ProductWithLike) => p.product_id !== product_id);
                await remove(`/likes/remove-like/${likeToRemove}?user_id=${user_id}`);
                showToast('Item removed from likes', 'success');
                setLikes([...newLikes]);
                setIsLiked(false);
            } catch (error) {
                showToast('Error removing item from likes', 'error');
                console.error(error);
            }
        } else {
            try {
                const endpoint = `/likes/add-like`;
                const newLikes = await post(endpoint, {
                    product_id,
                    user_id: user_id,
                });
                showToast('Item added to likes', 'success');
                setLikes([...newLikes]);
                setIsLiked(true);
            } catch (error) {
                showToast('Error adding item to likes', 'error');
                console.error(error);
            }
        }
    };


    return (
        <Stack direction="column" spacing={1} alignItems="center" onClick={handleLike} className="pointer">
            {liked ? <Favorite htmlColor="var(--blue)" /> : <FavoriteBorderOutlined htmlColor="var(--blue)" />}
            {
                isButton && <Typography variant="subtitle2" component="small" fontSize={12} color="gray" fontWeight={300} >{liked ? 'Remove from likes' : 'Add to likes'}</Typography>
            }
        </Stack>
    );
};

export default LikeItem;
