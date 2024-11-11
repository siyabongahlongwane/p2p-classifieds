export const isLiked = (product_id: number, productIds: number[]): boolean => {
    console.log(product_id, productIds);
    return productIds.includes(product_id);
}