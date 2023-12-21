import Sample from '../models/sample.model';
import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import fs from "fs";
import handlebars from "handlebars";
import transporter from "../middleware/transporter";

export const getAll = async (req, res) => {
    // return await User.findAll()
    try {
        const result = await User.findAll();
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
};

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
        const token = jwt.sign(payload, 'District_Kayu')

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

export const registerUser = async (req, res) => {
    try {
        const { fullname, gender, username, email, password } = req.body

        const checkUser = await User.findOne({
            where: { [Op.or]: [ {username}, {email} ] }
        })

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        if (checkUser == null) {
            const result = await User.create({
                fullname,
                gender,
                username,
                email,
                password: hashPassword
            });

            // const payload = {
            //     id: result.id
            // }

            // const token = jwt.sign(payload, process.env.MYSQL_PASSWORD)

            // const data = fs.readFileSync('./template.html', 'utf-8')
            // const tempCompile = await handlebars.compile(data)
            // const tempResult = tempCompile({ username: username, link: `http://localhost:3000/verify/${token}` })

            // await transporter.sendMail({
            //     from: 'altairlink26@gmail.com',
            //     to: email,
            //     subject: 'Email Confirmation',
            //     html: tempResult
            // })

            return res.status(200).send({status: "Register Success"});
        } else {
            return res.status(400).send({
                message: 'username or email has been used'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: "Failed Register"});
    }
};

// export const checkEmail = async (req, res) => {
//     try {
//         const { email } = req.body
//         const checkUser = await User.findOne({
//             where: { email }
//         })

//         console.log(checkUser);

//         if (checkUser != null) {
//             // const payload = {
//             //     id: checkUser.id
//             // }
//             // const token = jwt.sign(payload, process.env.TOKEN_KEY)

//             const data = fs.readFileSync('./resetPasswordMail.html', 'utf-8')
//             const tempCompile = await handlebars.compile(data)
//             const tempResult = tempCompile({ email: email, link: `http://localhost:2000/reset-password/${email}` })

//             await transporter.sendMail({
//                 from: 'altairlink26@gmail.com',
//                 to: email,
//                 subject: 'Email Confirmation',
//                 html: tempResult
//             })
//             return res.status(200).send('Email has been Verified')
//         }

//         return res.status(400).send('Email is not registered')
//     } catch (error) {
//         console.log(error);
//         res.status(400).send({ error: error.message })
//     }
// };

// export const verifyUser = async (req, res) => {
//     try {
//         await User.update({ isVerified: true }, 
//         {
//             where: { id: req.user.id }
//         })

//         res.status(200).send('Account has been Verified')
//     } catch (error) {
//         console.log(error);
//         res.status(400).send({ error: error.message })
//     }
// };

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

// export const changePassword = async (req, res) => {
//     try {
//         const { oldPassword, newPassword ,newPasswordConfirmation } = req.body
//         const findUser = await User.findOne({
//             where: { id: req.user.id }
//         })
      
//         const isValidOldPassword = await bcrypt.compare(oldPassword, findUser.password)

//         if (!isValidOldPassword) {
//             return res.status(400).send({ message: 'Incorrect old password!' })
//         }

//         if (oldPassword == newPassword) {
//             return res.status(400).send({ message: 'New password cannot be the same as the old password' })
//         }

//         if (newPassword !== newPasswordConfirmation) {
//             return res.status(400).send({ message: 'New password must match!' })
//         }

//         const salt = await bcrypt.genSalt(10)
//         const hashPassword = await bcrypt.hash(newPasswordConfirmation, salt)

//         await User.update(
//             { password: hashPassword },
//             { where: { id: req.user.id } }
//         )

//         return res.status(200).send('Password successfully changed!')
//     } catch (error) {
//         console.log(error);
//         res.status(400).send({ error: error.message })
//     }
// }
