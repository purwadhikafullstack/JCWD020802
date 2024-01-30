import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import handlebars from "handlebars";
import transporter from "../middleware/transporter";

export const getAll = async (req, res) => {
    try {
        const result = await User.findAll();
        res.status(200).send(result);
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
            return res.status(404).send({
                message: 'User not found'
            })
        }
        
        // if (!checkUser.isVerified) {
        //     return res.status(401).send({
        //         message: 'Your account is still not verified'
        //     })
        // }

        const isValidPassword = await bcrypt.compare(password, checkUser.password)

        if (!isValidPassword) {
            return res.status(401).send({
                message: 'Incorrect Password'
            })
        }

        const payload = { id: checkUser.id}
        const token = jwt.sign(payload, 'DistrictKayu')

        res.status(200).send({
            token,
            message: 'Login Success',
            result: checkUser
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
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
            const data = fs.readFileSync('./verifyRegisterEmail.html', 'utf-8')
            const tempCompile = await handlebars.compile(data)
            const tempResult = tempCompile({ email: email, link: `http://localhost:5173/register-user/${token}` })

            await transporter.sendMail({
                from: process.env.GMAIL_EMAIL,
                to: email,
                subject: 'Email Confirmation',
                html: tempResult
            })

            return res.status(200).send({status: "Email Sent!"});
        } else {
            return res.status(400).send({
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
        const { fullname, gender, password } = req.body

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        await User.update({ 
            fullname,
            gender,
            password: hashPassword,
            isVerified: true
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

// export const resetPassword = async (req, res) => {
//     try {
//         const { email, newPassword ,newPasswordConfirmation } = req.body
//         // const { email } = req.params
//         const findUser = await User.findOne({
//             where: { email }
//         })
        
//         if (newPassword !== newPasswordConfirmation) {
//             return res.status(400).send({ message: 'New password must match!' })
//         }

//         const salt = await bcrypt.genSalt(10)
//         const hashPassword = await bcrypt.hash(newPasswordConfirmation, salt)

//         await User.update(
//             { password: hashPassword },
//             { where: { email } }
//         )

//         return res.status(200).send('Password successfully changed!')
//     } catch (error) {
//         console.log(error);
//         res.status(400).send({ error: error.message })
//     }
// };
