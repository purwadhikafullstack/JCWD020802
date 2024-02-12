import ProductCategory from "../models/product.category"

export const getAllCategory = async (req, res) => {
    try {
        const result = await ProductCategory.findAll({
            where: { isDeleted: false }
        })
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(402).send({ message: error.message });
    }
}

export const getCategory = async (req, res) => {
    try {
        const { page, sortBy, sortOrder, category } = req.query

        const limit = 10
        const offset = (page - 1) * limit

        const order = sortBy && sortOrder ? [[sortBy, sortOrder]] : [];

        const result = await ProductCategory.findAndCountAll({
            where: { 
                isDeleted: false,
                ...(category && { categoryName: category })
            }, offset, limit, order
        });

        const totalPages = Math.ceil(result.count / limit)
        
        res.status(200).send({
            totalItems: result.count,
            totalPages,
            currentPage: page,
            pageSize: limit,
            categories: result.rows
        });
    } catch (error) {
        console.log(error);
        res.status(402).send({ message: error.message });
    }
};

export const addCategory = async (req, res) => {
    try {
        const { categoryName } = req.body

        const checkCategory = await ProductCategory.findOne({
            where: [
                { categoryName },
                { isDeleted: false }
            ]
        })

        if (checkCategory == null) {
            await ProductCategory.create({ 
                categoryName,
                categoryPicture: req.file?.path
            })
            return res.status(200).send({status: "Category Successfully Added!"});
        } else {
            res.status(401).send({status: "Category already exist!"});
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
}

export const editCategoryById = async (req, res) => {
    try {
        const { id } = req.params
        const { categoryName } = req.body

        const category = await ProductCategory.findOne({
            where: [
                { id },
                { isDeleted: false }
            ]
        });

        if (!category) {
            res.status(401).send({status: "Category doesn't exist!"});
        }

        await ProductCategory.update({ 
            categoryName,
            categoryPicture: req.file?.path
        }, {
            where: [
                { id },
                { isDeleted: false }
            ]
        })
        return res.status(200).send({status: "Category successfully updated!"})
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
};

export const trashCategoryById = async (req, res) => {
    try {
        const { id } = req.params
        const category = await ProductCategory.findOne({
            where: [
                { id },
                { isDeleted: false }
            ]
        });

        if (!category) {
            res.status(402).send({status: "Category doesn't exist!"});
        }

        await ProductCategory.update({
            isDeleted: true
        },{ 
            where: [
                { id },
                { isDeleted: false }
            ]
        })
        return res.status(200).send({status: "Category moved to trash!"})
    } catch (error) {
        console.log(error);
        res.status(403).send({ message: error.message });
    }
}

export const getAllTrashCategory = async (req, res) => {
    try {
        const result = await ProductCategory.findAll({
            where: { isDeleted: true }
        });
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
};

export const restoreCategoryById = async (req, res) => {
    try {
        const { id } = req.params
        const trashCategory = await Category.findOne({
            where: [
                { id },
                { isDeleted: true }
            ]
        });

        if (!trashCategory) {
            res.status(401).send({status: "Category doesn't exist in trash!"});
        }

        await Category.update({
            isDeleted: true
        },{ 
            where: [
                { id },
                { isDeleted: true }
            ] 
        })
        return res.status(200).send({status: "Category successfully restored!"})
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
}

export const deleteCategoryById = async (req, res) => {
    try {
        const { id } = req.params

        const trashCategory = await ProductCategory.findOne({
            where: [
                { id },
                { isDeleted: true }
            ]
        });

        if (!trashCategory) {
            res.status(401).send({status: "Category doesn't exist in trash!"});
        }

        await ProductCategory.destroy({
            where: [
                { id },
                { isDeleted: true }
            ]
        })
        return res.status(200).send({status: "Category successfully deleted!"})
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
}