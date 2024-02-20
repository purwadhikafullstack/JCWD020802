import Stock from "../models/stock";
import Warehouse from "../models/warehouse";
import Product from "../models/product"
import { Op } from 'sequelize';

export const getStock = async (req, res) => {
    try {
        const { page, sortBy, sortOrder, searchTerm, warehouse, product } = req.query

        const limit = 8
        const offset = (page - 1) * limit

        let order = [];

        if (sortBy && sortOrder) {
            if (sortBy === 'label') {
                order = [[{ model: Warehouse }, sortBy, sortOrder]];
            } else if (sortBy === 'productName') {
                order = [[{ model: Product }, sortBy, sortOrder]];
            } else {
                order = [[sortBy, sortOrder]];
            }
        }

        const result = await Stock.findAndCountAll({
            include: [
                {
                    model: Warehouse,
                    attributes: ['label']
                },
                {
                    model: Product,
                    attributes: ['productName']
                }
            ],
            where: { 
                isDeleted: false,
                ...(warehouse && { '$Warehouse.label$': warehouse }),
                ...(product && { '$Product.productName$': product }),
                ...(searchTerm && {
                    [Op.or]: [
                        { '$Warehouse.label$': { [Op.like]: `%${searchTerm}%` } },
                        { '$Product.productName$': { [Op.like]: `%${searchTerm}%` } }
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
            stocks: result.rows
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
};

export const addNewStock = async (req, res) => {
    try {
        const { stock, WarehouseId, ProductId } = req.body

        const checkWarehouse = await Warehouse.findOne({
            where: [
                { id: WarehouseId },
                { isDeleted: false }
            ]
        })

        const checkProduct = await Product.findOne({
            where: [
                { id: ProductId },
                { isDeleted: false }
            ]
        })

        const checkStock = await Stock.findOne({
            where: [
                { WarehouseId },
                { ProductId }
            ]
        })

        if (!checkWarehouse) {
            return res.status(402).send({status: "Warehouse didn't exist!"});
        }

        if (!checkProduct) {
            return res.status(403).send({status: "Product didn't exist!"});
        }

        if (checkStock) {
            return res.status(404).send({status: "Stock already exist!"});
        }

        await Stock.create({
            stock,
            WarehouseId,
            ProductId
        })

        const productStock = await Stock.findAll({
            where: [
                { ProductId },
                { isDeleted: false }
            ]
        })

        let totalStock = 0;
        productStock.forEach((item) => {
            totalStock += item.stock;
        });

        await Product.update({
            totalStock
        }, {
            where: { id: ProductId }
        })
        return res.status(200).send({status: "New Stock Successfully Added!"});
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
}

export const editStockById = async (req, res) => {
    try {
        const { id } = req.params
        const { stock, WarehouseId, ProductId } = req.body

        const checkWarehouse = await Warehouse.findOne({
            where: [
                { id: WarehouseId },
                { isDeleted: false }
            ]
        })

        const checkProduct = await Product.findOne({
            where: [
                { id: ProductId },
                { isDeleted: false }
            ]
        })

        if (!checkWarehouse) {
            return res.status(402).send({status: "Warehouse didn't exist!"});
        }

        if (!checkProduct) {
            return res.status(402).send({status: "Product didn't exist!"});
        }

        await Stock.update({ 
            stock,
            WarehouseId,
            ProductId
        }, {
            where: [
                { id },
                { isDeleted: false }
            ]
        })

        const productStock = await Stock.findAll({
            where: [
                { ProductId },
                { isDeleted: false }
            ]
        })

        let totalStock = 0;
        productStock.forEach((item) => {
            totalStock += item.stock;
        });

        await Product.update({
            totalStock
        }, {
            where: { id: ProductId }
        })
        return res.status(200).send({status: "Stock successfully updated!"})
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
};

export const trashStockById = async (req, res) => {
    try {
        const { id } = req.params
        const checkStock = await Stock.findOne({
            where: [
                { id },
                { isDeleted: false }
            ]
        });

        if (!checkStock) {
            res.status(402).send({status: "Stock doesn't exist!"});
        }

        await Stock.update({
            isDeleted: true
        },{ 
            where: [
                { id },
                { isDeleted: false }
            ]
        })

        const productStock = await Stock.findAll({
            where: [
                { ProductId: checkStock.ProductId },
                { isDeleted: false }
            ]
        })

        let totalStock = 0;
        productStock.forEach((item) => {
            totalStock += item.stock;
        });

        await Product.update({
            totalStock
        }, {
            where: { id: checkStock.ProductId }
        })
        return res.status(200).send({status: "Stock moved to trash!"})
    } catch (error) {
        console.log(error);
        res.status(403).send({ message: error.message });
    }
}

export const getAllTrashStock = async (req, res) => {
    try {
        const result = await Stock.findAll({
            include: [
                {
                    model: Warehouse,
                    attributes: ['label']
                },
                {
                    model: Product,
                    attributes: ['productName']
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

export const restoreStockById = async (req, res) => {
    try {
        const { id } = req.params
        const trashStock = await Stock.findOne({
            where: [
                { id },
                { isDeleted: true }
            ]
        });

        if (!trashStock) {
            res.status(401).send({status: "Stock doesn't exist in trash!"});
        }

        await Stock.update({
            isDeleted: true
        },{ 
            where: [
                { id },
                { isDeleted: true }
            ] 
        })
        return res.status(200).send({status: "Stock successfully restored!"})
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
}

export const deleteStockById = async (req, res) => {
    try {
        const { id } = req.params

        const trashStock = await Stock.findOne({
            where: [
                { id },
                { isDeleted: true }
            ]
        });

        if (!trashStock) {
            res.status(401).send({status: "Stock doesn't exist in trash!"});
        }

        await Stock.destroy({
            where: [
                { id },
                { isDeleted: true }
            ]
        })
        return res.status(200).send({status: "Stock successfully deleted!"})
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
}