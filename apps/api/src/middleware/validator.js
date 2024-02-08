import { body, validationResult, query } from 'express-validator'

export const checkLogin = async (req, res, next) => {
    try {
        await query('email')
            .notEmpty()
            .withMessage('Email must be filled!')
            .run(req)
        await query('password')
            .notEmpty()
            .withMessage('password is required!')
            .run(req)

        const validation = validationResult(req)
        console.log(validation);

        if (validation.isEmpty()) {
            return next()
        } else {
            return res.status(400).send({
                message: 'Validation invalid',
                error: validation.array()
            })
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
};

export const checkRegisterEmail = async (req, res, next) => {
    try {
        await body('email')
            .notEmpty()
            .isEmail()
            .withMessage('Email is required!')
            .run(req)

        const validation = validationResult(req)

        if (validation.isEmpty()) {
            return next()
        } else {
            return res.status(400).send({
                message: 'Validation invalid',
                error: validation.array()
            })
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
}

export const checkRegisterUser = async (req, res, next) => {
    try {
        await body('fullname')
            .notEmpty()
            .withMessage('fullname is required!')
            .run(req)
        await body('gender')
            .notEmpty()
            .withMessage('gender is required!')
            .run(req)
        await body('password')
            .notEmpty()
            .withMessage('password is required!')
            .run(req)

        const validation = validationResult(req)

        if (validation.isEmpty()) {
            return next()
        } else {
            return res.status(400).send({
                message: 'Validation invalid',
                error: validation.array()
            })
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
}

