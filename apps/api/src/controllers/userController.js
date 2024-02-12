import { Op } from "sequelize";
import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import handlebars from "handlebars";
import transporter from "../middleware/transporter";
import path from "path";

export const getAll = async (req, res) => {
    try {
        const { page, sortBy, sortOrder, searchTerm, gender, role } = req.query

        const limit = 8
        const offset = (page - 1) * limit

        const order = sortBy && sortOrder ? [[sortBy, sortOrder]] : [];

        const result = await User.findAndCountAll({
            where: {
                isDeleted: false,
                [Op.not]: [
                    { role: 'Super Admin' },
                    { isFullyRegistered: true }
                ],
                ...(gender && { gender }),
                ...(role && { role }),
                ...(searchTerm && {
                    [Op.or]: [
                        { fullname: { [Op.like]: `%${searchTerm}%` } },
                        { email: { [Op.like]: `%${searchTerm}%` } },
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
            users: result.rows
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
};


export const getById = async (req, res) => {
    try {
        const result = await User.findOne({
            where: { id: req.user.id } 
        })
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.query
        const checkUser = await User.findOne({
            where: { email }
        })

        if (!checkUser) {
            return res.status(400).send({
                message: 'User not found! Please check your email!'
            })
        }
        
        if (!checkUser.isVerified) {
            return res.status(401).send({
                message: 'Your account is still not verified! Please check your email to verify your account or resend email for verification!'
            })
        }

        const isValidPassword = await bcrypt.compare(password, checkUser.password)

        if (!isValidPassword) {
            return res.status(402).send({
                message: 'Incorrect Password'
            })
        }

        const payload = { 
            id: checkUser.id,
            role: checkUser.role
        }

        if (checkUser.role == 'Super Admin' || checkUser.role == "Warehouse Admin") {
            const adminToken = jwt.sign(payload, 'DistrictKayu')

            return res.status(200).send({
                adminToken,
                message: 'Login Success',
                result: checkUser
            });
        } else {
            const token = jwt.sign(payload, 'DistrictKayu')
    
            res.status(200).send({
                token,
                message: 'Login Success',
                result: checkUser
            });
        }
    } catch (error) {
        console.log(error);
        res.status(403).send({ message: error.message });
    }
};

export const keepLogin = async (req, res) => {
    try {
        const result = await User.findOne({
            where: 
            {
                id: req.user.id
            }
        })
        res.status(200).send(result)
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message })
    }
};

export const sendRegisterEmail = async (req, res) => {
    try {
        const { email } = req.body

        const checkUser = await User.findOne({
            where: { email }
        })

        if (checkUser == null) {
            const result = await User.create({ email });
            const payload = { id: result.id }
            const token = jwt.sign(payload, 'DistrictKayu', { expiresIn: '1h' })
            const data = fs.readFileSync(path.join(__dirname, '../../verifyRegisterEmail.html'), 'utf-8')
            const tempCompile = await handlebars.compile(data)
            const tempResult = tempCompile({ email: email, link: `${process.env.LOCAL_LINK}register-user/${token}` })

            await transporter.sendMail({
                from: process.env.GMAIL_EMAIL,
                to: email,
                subject: 'Email Confirmation',
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

export const registerGoogleUser = async (req, res) => {
    try {
        const { fullname, email } = req.query

        const checkUser = await User.findOne({
            where: { email }
        })

        if (checkUser == null) {
            await User.create({
                fullname, 
                email,
                isVerified: true,
                isFullyRegistered: true,
                useProvider: true
            });
            return res.status(200).send({status: "Register Success"});
        } else {
            return res.status(400).send({
                message: 'Email already registered'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: "Failed Register"});
    }
};

export const registerUser = async (req, res) => {
    try {
        const { fullname, birthdate, gender, password } = req.body

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        await User.update({ 
            fullname,
            birthdate,
            gender,
            password: hashPassword,
            isVerified: true,
            isFullyRegistered: true
        },{
            where: { id: req.user.id }
        })

        return res.status(200).send({status: "Email has been verified & register success"});
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: "Failed Register"});
    }
};

export const checkEmail = async (req, res) => {
    try {
        const { email } = req.query
        const result = await User.findOne({ where: { email } });

        if (result != null) {
            return res.status(200).send(result);
        } else {
            return res.status(400).send({ message: 'Email not found!' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
}


export const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body

        const user = await User.findOne({
            where: { email }
        })

        if (user !== null) {
            if (!user.isVerified) {
                const payload = { id: user.id }
                const token = jwt.sign(payload, 'DistrictKayu', { expiresIn: '1h' })
                if (user.isFullyRegistered) {
                    const data = fs.readFileSync(path.join(__dirname, '../../verifyEmail.html'), 'utf-8')
                    const tempCompile = await handlebars.compile(data)
                    const tempResult = tempCompile({ email: email, link: `${process.env.LOCAL_LINK}verify-email/${token}` })
    
                    await transporter.sendMail({
                        from: process.env.GMAIL_EMAIL,
                        to: email,
                        subject: 'Email Verification',
                        html: tempResult
                    })
    
                    return res.status(200).send({status: "Email Sent!"});
                } else {
                    const data = fs.readFileSync(path.join(__dirname, '../../verifyRegisterEmail.html'), 'utf-8')
                    const tempCompile = await handlebars.compile(data)
                    const tempResult = tempCompile({ email: email, link: `${process.env.LOCAL_LINK}register-user/${token}` })
    
                    await transporter.sendMail({
                        from: process.env.GMAIL_EMAIL,
                        to: email,
                        subject: 'Email Verification & User Registration',
                        html: tempResult
                    })
        
                    return res.status(200).send({status: "Email Sent!"});
                } 
            } else {
                return res.status(400).send({ message: 'Email is already verified!' });
            }
        } else {
            return res.status(401).send({ message: 'Email is not registered!' });
        }
    } catch (error) {
        console.log(error);
        res.status(402).send({ message: "Failed to register"});
    }
};