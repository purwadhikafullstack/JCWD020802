import User from "../models/user";
import jwt from "jsonwebtoken";
import fs from "fs";
import handlebars from "handlebars";
import transporter from "../middleware/transporter";
import { Op } from 'sequelize';

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
            const data = fs.readFileSync('./verifyRegisterEmail.html', 'utf-8')
            const tempCompile = await handlebars.compile(data)
            const tempResult = tempCompile({ email: email, link: `http://localhost:5173/register-user/${token}` })

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