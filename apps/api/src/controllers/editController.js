import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import handlebars from "handlebars";
import transporter from "../middleware/transporter";

export const editFullname = async (req, res) => {
    try {
        const { fullname } = req.body

        await User.update(
            { fullname },
            { where: { id: req.user.id } }
        )
        
        res.status(200).send('Fullname successfully changed')
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message })
    }
}

export const editUsername = async (req, res) => {
    try {
        const { username } = req.body

        const checkUsername = await User.findOne({
            where: { username }
        })

        if (checkUsername) {
            return res.status(401).send({ message: `Username ${username} already exist!` })
        }

        await User.update(
            { username },
            { where: { id: req.user.id } }
        )
        
        res.status(200).send('Username successfully changed')
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message })
    }
}

export const editBirthdate = async (req, res) => {
    try {
        const { newBirthdate } = req.body

        const user = await User.findOne({
            where: req.user.id
        })

        if (newBirthdate == user.birthdate) {
            return res.status(401).send({ message: `Birthdate cannot be the same as the previous one!` })
        }

        await User.update(
            { birthdate: newBirthdate },
            { where: { id: req.user.id } }
        )
        
        res.status(200).send('Birthdate successfully changed')
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message })
    }
}

export const editGender = async (req, res) => {
    try {
        const { gender } = req.body

        const oldGender = await User.findOne({
            where: req.user.id
        })

        if (gender == oldGender) {
            return res.status(401).send({ message: `Gender cannot be the same as the previous one!` })
        }

        await User.update(
            { gender },
            { where: { id: req.user.id } }
        )
        
        res.status(200).send('Gender successfully changed')
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message })
    }
}

export const editEmail = async (req, res) => {
    try {
        const { email } = req.body

        const newEmail = await User.findOne({
            where: { email }
        })

        if (newEmail) {
            return res.status(401).send({ message: `Email ${email} already exist!` })
        }

        const payload = { id: req.user.id }
        const token = jwt.sign(payload, 'DistrictKayu', { expiresIn: '1h' })
        const data = fs.readFileSync('./verifyNewEmail.html', 'utf-8')
        const tempCompile = await handlebars.compile(data)
        const tempResult = tempCompile({ email: email, link: `http://localhost:5173/verify-new-email/${token}` })

        await transporter.sendMail({
            from: process.env.GMAIL_EMAIL,
            to: email,
            subject: 'Email Verification',
            html: tempResult
        })

        await User.update(
            { 
                email,
                isVerified: false
            },
            { where: { id: req.user.id } }
        )
        
        res.status(200).send('Email sent & successfully changed')
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message })
    }
}

export const verifyNewEmail = async (req, res) => {
    try {
        await User.update(
            { isVerified: true },
            { where: { id: req.user.id } }
        )

        res.status(200).send('New email successfully verified!')
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message })
    }
}

export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword ,newPasswordConfirmation } = req.body
        const user = await User.findOne({
            where: { id: req.user.id }
        })

        if (user.useProvider) {
            return res.status(400).send({ message: 'You cannot change your Google account password in this website!' })
        }
      
        const isValidOldPassword = await bcrypt.compare(oldPassword, user.password)

        if (!isValidOldPassword) {
            return res.status(400).send({ message: 'Incorrect old password!' })
        }

        if (oldPassword == newPassword) {
            return res.status(400).send({ message: 'New password cannot be the same as the old password' })
        }

        if (newPassword !== newPasswordConfirmation) {
            return res.status(400).send({ message: 'New password must match!' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(newPasswordConfirmation, salt)

        await User.update(
            { password: hashPassword },
            { where: { id: req.user.id } }
        )

        return res.status(200).send('Password successfully changed!')
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: error.message })
    }
}

export const updatePhotoProfile = async (req, res) => {
    try {
        await User.update({ photoProfile: req.file?.path }, {
            where: {
                id: req.user.id
            }
        })
        res.status(200).send('Profile picture sucessfully updated')
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message })
    }
}
