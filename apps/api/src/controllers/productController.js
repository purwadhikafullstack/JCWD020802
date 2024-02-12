import Product from "../models/product"
import ProductCategory from "../models/product.category";
import { Op } from 'sequelize';

export const getAllProduct = async (req, res) => {
    try {
        const result = await Product.findAll({
            where: { isDeleted: false }
        })
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(402).send({ message: error.message });
    }
}

export const getProduct = async (req, res) => {
    try {
        const { page, sortBy, sortOrder, searchTerm, category } = req.query

        const limit = 10
        const offset = (page - 1) * limit

        const order = sortBy && sortOrder ? [[sortBy, sortOrder]] : [];

        const result = await Product.findAndCountAll({
            include: [
                {
                    model: ProductCategory,
                    attributes: ['categoryName']
                }
            ],
            where: { 
                isDeleted: false,
                ...(category && { '$ProductCategory.categoryName$': category }),
                ...(searchTerm && {
                    [Op.or]: [
                        { productName: { [Op.like]: `%${searchTerm}%` } }
                    ],
                })
            }, offset, limit, order
        });

        const totalPages = Math.ceil(result.count / limit)
        
        res.status(200).send({
            totalItems: result.count,
            totalPages,
            currentPage: page,
            pageSize: limit,
            products: result.rows
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
};

export const addProduct = async (req, res) => {
    try {
        const { productName, productWeight, productDetail, productPrice, ProductCategoryId } = req.body

        const checkProduct = await Product.findOne({
            where: [
                { productName },
                { isDeleted: false }
            ]
        })

        const findCategory = await ProductCategory.findOne({
            where: [
                { id: ProductCategoryId },
                { isDeleted: false }
            ]
        })

        if (!findCategory) {
            return res.status(402).send({status: "Category didn't exist!"});
        }

        if (checkProduct == null) {
            await Product.create({
                productName,
                productWeight,
                productDetail,
                productPrice,
                ProductCategoryId,
                productMainPicture: req.file?.path
            })
            return res.status(200).send({status: "Product Successfully Added!"});
        } else {
            res.status(401).send({status: "Product name already exist!"});
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
}

export const editProductById = async (req, res) => {
    try {
        const { id } = req.params
        const { productName, productWeight, productDetail, productPrice, category } = req.body

        const checkProduct = await Product.findOne({
            where: [
                { id },
                { isDeleted: false }
            ]
        });

        if (!checkProduct) {
            res.status(401).send({status: "Product doesn't exist!"});
        }

        const findCategory = await ProductCategory.findOne({
            where: [
                { categoryName: category },
                { isDeleted: false }
            ]
        })

        if (!findCategory) {
            return res.status(402).send({status: "Category didn't exist!"});
        }

        await Product.update({ 
            productName,
                productWeight,
                productDetail,
                productPrice,
                ProductCategoryId: findCategory.id 
        }, {
            where: [
                { id },
                { isDeleted: false }
            ]
        })
        return res.status(200).send({status: "Product successfully updated!"})
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
};

export const trashProductById = async (req, res) => {
    try {
        const { id } = req.params
        const checkProduct = await Product.findOne({
            where: [
                { id },
                { isDeleted: false }
            ]
        });

        if (!checkProduct) {
            res.status(402).send({status: "Product doesn't exist!"});
        }

        await Product.update({
            isDeleted: true
        },{ 
            where: [
                { id },
                { isDeleted: false }
            ]
        })
        return res.status(200).send({status: "Product moved to trash!"})
    } catch (error) {
        console.log(error);
        res.status(403).send({ message: error.message });
    }
}

export const getAllTrashProduct = async (req, res) => {
    try {
        const result = await Product.findAll({
            include: [
                {
                    model: ProductCategory,
                    attributes: ['categoryName']
                }
            ],
            where: { isDeleted: true }
        });
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
};

export const restoreProductById = async (req, res) => {
    try {
        const { id } = req.params
        const trashProduct = await Product.findOne({
            where: [
                { id },
                { isDeleted: true }
            ]
        });

        if (!trashProduct) {
            res.status(401).send({status: "Product doesn't exist in trash!"});
        }

        await Product.update({
            isDeleted: true
        },{ 
            where: [
                { id },
                { isDeleted: true }
            ] 
        })
        return res.status(200).send({status: "Product successfully restored!"})
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
}

export const deleteProductById = async (req, res) => {
    try {
        const { id } = req.params

        const trashProduct = await Product.findOne({
            where: [
                { id },
                { isDeleted: true }
            ]
        });

        if (!trashProduct) {
            res.status(401).send({status: "Product doesn't exist in trash!"});
        }

        await Product.destroy({
            where: [
                { id },
                { isDeleted: true }
            ]
        })
        return res.status(200).send({status: "Product successfully deleted!"})
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
}