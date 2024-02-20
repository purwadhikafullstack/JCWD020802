import City from "../models/city";
import Province from "../models/province";
import Warehouse from "../models/warehouse"
import { Op } from 'sequelize';

export const getAllWarehouse = async (req, res) => {
    try {
        const result = await Warehouse.findAll({
            where: { isDeleted: false }
        })
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(405).send({ message: error.message });
    }
}

export const getWarehouse = async (req, res) => {
    try {
        const { page, sortBy, sortOrder, searchTerm, province, city } = req.query

        const limit = 8
        const offset = (page - 1) * limit

        let order = [];

        if (sortBy && sortOrder) {
            if (sortBy === 'city_name') {
                order = [[{ model: City }, sortBy, sortOrder]];
            } else if (sortBy === 'province') {
                order = [[{ model: City }, 'Province', sortBy, sortOrder]];
            } else {
                order = [[sortBy, sortOrder]];
            }
        }

        const result = await Warehouse.findAndCountAll({
            include: [
                {
                    model: City,
                    attributes: ['type', 'city_name', 'ProvinceId'],
                    include: [
                        {
                            model: Province,
                            attributes: ['province']
                        }
                    ]
                }
            ],
            where: { 
                isDeleted: false,
                ...(province && { '$City.Province.province$': province }),
                ...(city && { 
                    [Op.and]: [
                        { '$City.type$': city.split(' ')[0] },
                        { '$City.city_name$': city.split(' ')[1] }
                    ]
                }),
                ...(searchTerm && {
                    [Op.or]: [
                        { label: { [Op.like]: `%${searchTerm}%` } },
                        { address: { [Op.like]: `%${searchTerm}%` } },
                    ],
                }),
            }, offset, limit, order
        });

        const totalPages = Math.ceil(result.count / limit)
        
        res.status(200).send({
            totalItems: result.count,
            totalPages,
            currentPage: page,
            pageSize: limit,
            warehouses: result.rows
        });
    } catch (error) {
        console.log(error);
        res.status(402).send({ message: error.message });
    }
};

export const addWarehouse = async (req, res) => {
    try {
        const { latitude, longtitude, label, CityId, address } = req.body

        const checkWarehouse = await Warehouse.findOne({
            where: [
                { label },
                { isDeleted: false }
            ]
        })

        if (checkWarehouse == null) {
            await Warehouse.create({
                latitude,
                longtitude,
                label,
                CityId,
                address
            })
            return res.status(200).send({status: "Warehouse Successfully Added!"});
        } else {
            res.status(401).send({status: "Warehouse name already exist!"});
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
}

export const editWarehouseById = async (req, res) => {
    try {
        const { id } = req.params
        const { latitude, longtitude, label, CityId, address } = req.body

        const warehouse = await Warehouse.findOne({
            where: [
                { id },
                { isDeleted: false }
            ]
        });

        if (!warehouse) {
            res.status(401).send({status: "Warehouse doesn't exist!"});
        }

        await Warehouse.update({
            latitude,
            longtitude,
            label,
            CityId,
            address,
        }, {
            where: [
                { id },
                { isDeleted: false }
            ]
        })
        return res.status(200).send({status: "Warehouse successfully updated!"})
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
};

export const trashWarehouseById = async (req, res) => {
    try {
        const { id } = req.params
        const warehouse = await Warehouse.findOne({
            where: [
                { id },
                { isDeleted: false }
            ]
        });

        if (!warehouse) {
            res.status(402).send({status: "Warehouse doesn't exist!"});
        }

        await Warehouse.update({
            isDeleted: true
        },{ 
            where: [
                { id },
                { isDeleted: false }
            ]
        })
        return res.status(200).send({status: "Warehouse moved to trash!"})
    } catch (error) {
        console.log(error);
        res.status(403).send({ message: error.message });
    }
}

export const getAllTrashWarehouse = async (req, res) => {
    try {
        const result = await Warehouse.findAll({
            include: [
                {
                    model: City,
                    attributes: ['type', 'city_name', 'ProvinceId'],
                    include: [
                        {
                            model: Province,
                            attributes: ['province']
                        }
                    ]
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

export const restoreWarehouseById = async (req, res) => {
    try {
        const { id } = req.params
        const trashWarehouse = await Warehouse.findOne({
            where: [
                { id },
                { isDeleted: true }
            ]
        });

        if (!trashWarehouse) {
            res.status(401).send({status: "Warehouse doesn't exist in trash!"});
        }

        await Warehouse.update({
            isDeleted: true
        },{ 
            where: [
                { id },
                { isDeleted: true }
            ] 
        })
        return res.status(200).send({status: "Warehouse successfully restored!"})
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
}

export const deleteWarehouseById = async (req, res) => {
    try {
        const { id } = req.params

        const trashWarehouse = await Warehouse.findOne({
            where: [
                { id },
                { isDeleted: true }
            ]
        });

        if (!trashWarehouse) {
            res.status(401).send({status: "Warehouse doesn't exist in trash!"});
        }

        await Warehouse.destroy({
            where: [
                { id },
                { isDeleted: true }
            ]
        })
        return res.status(200).send({status: "Warehouse successfully deleted!"})
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
}