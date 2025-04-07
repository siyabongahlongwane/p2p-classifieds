const { models: { Product, ProductPhoto } } = require('../db_models');

module.exports = {
    create: async (req, res) => {
        try {
            let { productPhotos, price } = req.body;
            delete req.body.photos;

            const data = { ...req.body, seller_gain: price, price: (+price * (1 + +process.env.MARK_UP)).toFixed(2) }
            console.log('NEW PRODUCT', data);

            const newProduct = await Product.create(data);

            if (!newProduct.product_id) return res.status(400).json({ err: 'Failed to create product' });

            productPhotos = productPhotos.map(photo => ({ ...photo, product_id: newProduct.product_id }));

            await ProductPhoto.bulkCreate(productPhotos);

            res.status(200).json({ payload: newProduct, msg: 'Product created successfully', success: true });
        } catch (err) {
            console.error(err);
            return res.status(400).json(err);
        }
    },
    fetch: async (req, res) => {
        try {
            console.log(req.query)

            const products = await Product.findAll({
                where: {
                    ...req.query
                },
                include: [{
                    model: ProductPhoto,
                    as: 'photos',
                    attributes: ['photo_id', 'photo_url']
                }]
            });

            return res.status(200).json({ payload: products, success: true });

        } catch (err) {
            console.error(err);
            return res.status(400).json(err);
        }
    },
    update: async (req, res) => {
        try {
            const { product_id } = req.params;

            if (!Number.isInteger(+product_id)) return res.status(400).json({ err: `Invalid product id: '${product_id}'` });

            const dbProduct = await Product.findByPk(+product_id);
            if (!dbProduct) return res.status(400).json({ 'err': "Update failed: product not found" })
            console.log({ dbProduct });

            if (+dbProduct?.dataValues?.seller_gain != +req.body?.price) {
                req.body.seller_gain = req.body?.price;
                req.body.price = (+req.body.price * (1 + +process.env.MARK_UP)).toFixed(2);
            }

            let { productPhotos } = req.body;
            productPhotos = productPhotos
                ?.filter(photo => !photo?.photo_id)
                ?.map(photo => ({ ...photo, product_id: +product_id }));

            await ProductPhoto.bulkCreate(productPhotos);

            const [updatedproduct] = await Product.update({ ...req.body }, { where: { product_id: +product_id } });

            if (!updatedproduct) return res.status(400).json({ err: `Failed to update product with id '${product_id}'` });

            res.status(200).json({ payload: updatedproduct, msg: 'Product updated successfully', success: true })
        } catch (err) {
            console.error(err)
            return res.status(400).json({ err });
        }
    },
    // WIP, fix foreign referencing on delete error
    remove: async (req, res) => {
        try {
            const { product_id } = req.params;
            if (!Number.isInteger(+product_id)) return res.status(400).json({ err: `Invalid product id: '${product_id}'` });

            const deletedProduct = await Product.destroy({
                where: {
                    product_id: +product_id
                }
            });

            if (!deletedProduct) return res.status(400).json({ err: `Failed to delete product with id '${product_id}'` });
            res.status(200).json({ msg: 'Product deleted successfully', success: true })
        } catch (err) {
            console.error(err)
            return res.status(400).json({ err });
        }
    }
}