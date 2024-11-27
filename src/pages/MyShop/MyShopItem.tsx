import { EditOutlined } from '@mui/icons-material'
import { Card, CardMedia, Box, Typography, IconButton } from '@mui/material'
import { Link } from 'react-router-dom';

const MyShopItem = ({ product }: { product: any }) => {
    const { title, photos, price, product_id } = product;
    console.log('PRODUCT', product)
    return (
        <Card sx={{ marginTop: 2, position: "relative" }}>
            <CardMedia
                component="img"
                height="200"
                src={photos?.[0]?.['photo_url']}
                alt={title}
                sx={{ border: "1px solid #ccc" }}
            />
            <Box sx={{ padding: 2 }}>
                <Typography variant="body1" noWrap>
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    R{price}
                </Typography>
            </Box>
            <Link to={`edit-product/${product_id}`}>
                <IconButton
                    color="primary"
                    title='Edit Product'
                    sx={{ position: "absolute", top: 8, right: 8 }}
                >
                    <EditOutlined />
                </IconButton></Link>
        </Card>
    )
}

export default MyShopItem