import Address from "../models/address";
import City from "../models/city";
import Province from "../models/province";

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

export const getByUserId = async (req, res) => {
    try {
        const { UserId } = req.params
        const result = await Address.findAll({
            include: [
                {
                    model: City,
                    attributes: ['city_name'],
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