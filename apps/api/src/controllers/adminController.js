import User from "../models/user";
import WarehouseAdmin from "../models/warehouse.admin";
import jwt from "jsonwebtoken";
import fs from "fs";
import handlebars from "handlebars";
import transporter from "../middleware/transporter";
import { Op } from 'sequelize';
import Warehouse from "../models/warehouse";
import path from "path";

export const getWHAdmin = async (req, res) => {
    try {
        const { page, sortBy, sortOrder, searchTerm, warehouse } = req.query

        const limit = 8
        const offset = (page - 1) * limit

        let order = [];

        if (sortBy && sortOrder) {
            if (sortBy === 'label') {
                order = [[{ model: WarehouseAdmin }, 'Warehouse', sortBy, sortOrder]];
            } else {
                order = [[sortBy, sortOrder]];
            }
        }

        const includeClause = {
            model: WarehouseAdmin,
            include: warehouse === undefined || warehouse === '' || warehouse === 'Not Assigned Yet' ? 
                {
                    model: Warehouse,
                    attributes: ['label'],
                } :
                {
                    model: Warehouse,
                    attributes: ['label'],
                    where: { label: warehouse },
                }
        }

        const whereClause = 
        warehouse === 'Not Assigned Yet' ? 
        {
            [Op.and]: [
                { role: 'Warehouse Admin' },
                { isDeleted: false },
                { isAssigned: false }
            ],
            ...(searchTerm && {
                [Op.or]: [
                    { fullname: { [Op.like]: `%${searchTerm}%` } },
                ],
            }),
        } :
        {
            [Op.and]: [
                { role: 'Warehouse Admin' },
                { isDeleted: false }
            ],
            ...(searchTerm && {
                [Op.or]: [
                    { fullname: { [Op.like]: `%${searchTerm}%` } },
                ],
            }),
        };

        const result = await User.findAndCountAll({
            include: includeClause,
            where: whereClause,
            offset,
            limit,
            order,
        });

        const totalPages = Math.ceil(result.count / limit)

        res.status(200).send({
            totalItems: result.count,
            totalPages,
            currentPage: page,
            pageSize: limit,
            users: result.rows
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
};

export const assignWHAdminByAdminId = async (req, res) => {
    try {
        const { UserId } = req.params
        const { WarehouseId } = req.body

        const checkAdmin = await WarehouseAdmin.findOne({
            where: { UserId }
        })

        if (checkAdmin) {
            return res.status(402).send({status: "Warehouse admin still not assign yet!"});
        }
        await WarehouseAdmin.create({
            UserId,
            WarehouseId
        })

        await User.update({
            isAssigned: true
        }, {
            where: { id: UserId }
        })

        return res.status(200).send({status: "Warehouse Admin Successfully Assigned!"});
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
}

export const editWHAdminByAdminId = async (req, res) => {
    try {
        const { UserId } = req.params
        const { WarehouseId } = req.body

        const checkAdmin = await WarehouseAdmin.findOne({
            where: { UserId }
        })

        if (!checkAdmin) {
            return res.status(402).send({status: "Warehouse admin still not assign yet!"});
        }
        await WarehouseAdmin.update({
            WarehouseId
        }, {
            where: { UserId }
        })

        return res.status(200).send({status: "Warehouse Admin Successfully Assigned!"});
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
}

export const sendRegisterWHAdminEmail = async (req, res) => {
    try {
        const { email } = req.body

        const checkUser = await User.findOne({
            where: { email }
        })

        if (!checkUser) {
            const result = await User.create({ 
                email,
                role: 'Warehouse Admin'
            });
            const payload = { id: result.id }
            const token = jwt.sign(payload, 'DistrictKayu', { expiresIn: '1h' })
            const data = fs.readFileSync(path.join(__dirname, '../../mail/verifyRegisterEmail.html'), 'utf-8')
            const tempCompile = await handlebars.compile(data)
            const tempResult = tempCompile({ email: email, link: `${process.env.LOCAL_LINK}register-user/${token}` })

            await transporter.sendMail({
                from: process.env.GMAIL_EMAIL,
                to: email,
                subject: 'Register Warehouse Admin',
                html: tempResult
            })

            return res.status(200).send({status: "Email Sent!"});
        } else {
            return res.status(401).send({
                message: 'Email already exist!'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: "Failed Register"});
    }
};

export const editUserById = async (req, res) => {
    try {
        const { id } = req.params
        const { fullname, birthdate, gender, email } = req.body

        const user = await User.findOne({
            where: [
                { id },
                { isDeleted: false }
            ]
        });

        if (!user) {
            res.status(401).send({status: "User doesn't exist!"});
        }

        await User.update({
            fullname,
            birthdate,
            gender,
            email
        }, {
            where: [
                { id },
                { isDeleted: false }
            ]
        })
        return res.status(200).send({status: "User successfully updated!"})
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
};

export const trashUserById = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findOne({
            where: [
                { id },
                { isDeleted: false }
            ]
        });

        if (!user) {
            res.status(402).send({status: "User doesn't exist!"});
        }

        await User.update({
            isDeleted: true
        },{ 
            where: [
                { id },
                { isDeleted: false }
            ]
        })
        return res.status(200).send({status: "User moved to trash!"})
    } catch (error) {
        console.log(error);
        res.status(403).send({ message: error.message });
    }
}

export const getAllTrashUser = async (req, res) => {
    try {
        const result = await User.findAll({
            where: [
                { isDeleted: true },
                {
                    [Op.not]: { role: 'Super Admin' }
                }
            ]
        });
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
};

export const restoreUserById = async (req, res) => {
    try {
        const { id } = req.params
        const trashUser = await User.findOne({
            where: [
                { id },
                { isDeleted: true },
                {
                    [Op.not]: { role: 'Super Admin' }
                }
            ]
        });

        if (!trashUser) {
            res.status(401).send({status: "User doesn't exist in trash!"});
        }

        await User.update({
            isDeleted: true
        },{ 
            where: [
                { id },
                { isDeleted: true },
                {
                    [Op.not]: { role: 'Super Admin' }
                }
            ] 
        })
        return res.status(200).send({status: "User successfully restored!"})
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
}

export const deleteUserById = async (req, res) => {
    try {
        const { id } = req.params

        const trashUser = await User.findOne({
            where: [
                { id },
                { isDeleted: true },
                {
                    [Op.not]: { role: 'Super Admin' }
                }
            ]
        });

        if (!trashUser) {
            res.status(401).send({status: "User doesn't exist in trash!"});
        }

        await User.destroy({
            where: [
                { id },
                { isDeleted: true },
                {
                    [Op.not]: { role: 'Super Admin' }
                }
            ]
        })
        return res.status(200).send({status: "User successfully deleted!"})
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
}