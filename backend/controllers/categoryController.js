const { models: { Category } } = require('../db_models');

module.exports = {
    create: async (req, res) => {
        try {
            await Category.create({ ...req.body });

            res.status(200).json({ msg: 'Category created successfully', success: true });
        } catch (err) {
            console.error(err)
            res.status(400).json(err);
        }
    },

    fetch: async (req, res) => {
        try {
            const categories = await Category.findAll();
            if (!categories) return res.status(400).json({ err: 'No categories found' });
            res.status(200).json({ payload: categories, success: true })
        } catch (err) {
            console.error(err)
            return res.status(400).json({ err });
        }
    },
    update: async (req, res) => {
        try {
            const { title } = req.body;
            const { category_id } = req.params;

            if (!Number.isInteger(+category_id)) return res.status(400).json({ err: `Invalid category id: '${category_id}'` });
            const [updatedCategory] = await Category.update({ title }, { where: { category_id: +category_id } });

            if (!updatedCategory) return res.status(400).json({ err: `Failed to update category with id '${category_id}'` });

            res.status(200).json({ msg: 'Category updated successfully', success: true })
        } catch (err) {
            console.error(err)
            return res.status(400).json({ err });
        }
    },
    remove: async (req, res) => {
        try {
            const { category_id } = req.params;
            if (!Number.isInteger(+category_id)) return res.status(400).json({ err: `Invalid category id: '${category_id}'` });

            const deletedCategory = await Category.destroy({
                where: {
                    category_id: +category_id
                }
            });

            if (!deletedCategory) return res.status(400).json({ err: `Failed to delete category with id '${category_id}'` });
            res.status(200).json({ msg: 'Category deleted successfully', success: true })
        } catch (err) {
            console.error(err)
            return res.status(400).json({ err });
        }
    }
}