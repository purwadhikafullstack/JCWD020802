import Address from "../models/address";
import City from "../models/city";
import Province from "../models/province";
import { Op } from "sequelize";

export const getProvince = async (req, res) => {
    try {
        const result = await Province.findAll();
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
}

export const getProvinceByCity = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Province.findAll({
            include: [{
                model: City,
                attributes: ['id', 'city_name'],
                where: { id }
            }]
        })
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
}

export const getCity = async (req, res) => {
    try {
        const result = await City.findAll();
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
}

export const getCityByProvince = async (req, res) => {
    try {
        const { ProvinceId } = req.params;
        const result = await City.findAll({
            where: { ProvinceId }
        })
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
}

export const getAllAddress = async (req, res) => {
    try {
        const result = await Address.findAll();
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
}

export const getAddressById = async (req, res) => {
    try {
        const { UserId } = req.params
        const { page, sortBy, sortOrder, searchTerm, province, city } = req.query

        const limit = 5
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

        const result = await Address.findAndCountAll({
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
                UserId,
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
            addresses: result.rows
        });
    } catch (error) {
        console.log(error);
        res.status(402).send({ message: error.message });
    }
};

export const getByUserId = async (req, res) => {
    try {
        const { UserId } = req.params
        const result = await Address.findAll({
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
            where: { UserId } 
        })
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
}

export const getUserMainAddress = async (req, res) => {
    try {
        const { UserId } = req.params
        const result = await Address.findOne({
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
            where: [
                { UserId }, 
                { isMain: true }
            ] 
        })
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
}

export const addAddress = async (req, res) => {
    try {
        const { latitude, longtitude, label, CityId, address, note } = req.body

        const checkAddress = await Address.findOne({ 
            where: { UserId: req.user.id } 
        })

        if (checkAddress == null) {
            await Address.create({
                latitude,
                longtitude,
                label,
                CityId,
                address,
                note,
                UserId: req.user.id,
                isMain: true
            })
            return res.status(200).send({status: "Address Successfully Added"});
        } else {
            await Address.create({
                latitude,
                longtitude,
                label,
                CityId,
                address,
                note,
                UserId: req.user.id
            })
            return res.status(200).send({status: "Address Successfully Added"});
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
}

export const changeAddressById = async (req, res) => {
    try {
        const { id } = req.params
        const { latitude, longtitude, label, CityId, address, note } = req.body

        const checkAddress = await Address.findByPk(id)

        if (!checkAddress) {
            return res.status(404).send({status: "Address Not Found!"})
        }

        await Address.update({
            latitude,
            longtitude,
            label,
            CityId,
            address,
            note
        }, { where: { id } }
        )
        return res.status(200).send({status: "Address updated successfully!"})
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
}

export const deleteAddressById = async (req, res) => {
    try {
        const { id } = req.params

        const checkAddress = await Address.findByPk(id)

        if (!checkAddress) {
            return res.status(402).send({status: "Address Not Found!"})
        }

        await Address.destroy({
            where: [
                { id }
            ]
        })
        return res.status(200).send({status: "Address successfully deleted!"})
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
}

export const changeMainAddressById = async (req, res) => {
    try {
        const { id } = req.params
        const { UserId } = req.body

        const findMainAddress = await Address.findOne({
            where: [
                { UserId },
                { isMain: true }
            ]
        })

        if (!findMainAddress) {
            return res.status(402).send({status: "Address Not Found!"})
        }

        await Address.update({
            isMain: false
        }, { where: [
            { UserId },
            { isMain: true }
        ]})

        await Address.update({
            isMain: true
        }, { where: [
            { id },
            { UserId },
            { isMain: false }
        ]})

        return res.status(200).send({status: "Main Address successfully changed!"})

    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message })
    }
}