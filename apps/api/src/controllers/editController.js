import User from "../models/user";

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
        const { birthdate } = req.body

        const oldBirthdate = await User.findOne({
            where: req.user.id
        })

        if (birthdate == oldBirthdate) {
            return res.status(401).send({ message: `Birthdate cannot be the same as the previous one!` })
        }

        await User.update(
            { birthdate },
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

        const checkEmail = await User.findOne({
            where: { email }
        })

        if (checkEmail) {
            return res.status(401).send({ message: `Email ${email} already exist!` })
        }

        await User.update(
            { 
                email,
                isVerified: 0
            },
            { where: { id: req.user.id } }
        )
        
        res.status(200).send('Email successfully changed')
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message })
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
