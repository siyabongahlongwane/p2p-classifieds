import { useEffect, useState } from "react";
import { Favorite, FavoriteBorderOutlined } from "@mui/icons-material";
import { Box } from "@mui/material";
import { useStore } from "../../stores/store";
import { isLiked } from "../../utils/product.util";
import useApi from "../../hooks/useApi";
import { ProductWithLike } from "../../typings";

interface LikeItemProps {
    user_id: string;
    product_id: number;
}

const LikeItem = ({ user_id, product_id }: LikeItemProps) => {
    const { likes, setLikes } = useStore();
    const [liked, setIsLiked] = useState(false);
    const { post, remove } = useApi(`${import.meta.env.VITE_API_URL}`);

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
                remove(`/likes/remove-like/${likeToRemove}?user_id=${user_id}`).then(
                    () => {
                        setLikes([...newLikes]);
                        setIsLiked(false);
                    }
                );
            } catch (error) {
                console.error(error);
            }
        } else {
            try {
                const endpoint = `/likes/add-like`;
                const newLikes = await post(endpoint, {
                    product_id,
                    user_id: user_id,
                });
                setLikes([...newLikes]);
                setIsLiked(true);
            } catch (error) {
                console.error(error);
            }
        }
    };


    return (
        <Box onClick={handleLike}>
            {liked ? <Favorite htmlColor="var(--blue)" /> : <FavoriteBorderOutlined htmlColor="var(--blue)" />}
        </Box>
    );
};

export default LikeItem;
