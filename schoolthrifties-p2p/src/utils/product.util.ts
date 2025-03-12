export const isLiked = (product_id: number, productIds: number[]): boolean => {
    return productIds.includes(product_id);
}

export const existsInCart = (product_id: number, productIds: number[]): boolean => {
    return productIds.includes(product_id);
}