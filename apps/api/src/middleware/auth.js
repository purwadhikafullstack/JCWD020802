const jwt = require('jsonwebtoken')

export const verifyToken = (req, res, next) => {
    try {
        let token = req.headers.authorization
        if (!token) {
            return res.status(404).send({
                message: 'Token Empty'
            })
        }

        token = token.split(' ')[1]
        let verifiedUser = jwt.verify(token, 'DistrictKayu')
        req.user = verifiedUser

        next()
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message })
    }
}

export const checkSuperAdminRole = (req, res, next) => {
    if (req.user.role === 'Super Admin') {
        return next()
    }

    return res.status(401).send({ message: 'Unauthorize (Super Admin only)!' })
}

export const checkCustomerRole = (req, res, next) => {
    if (req.user.role === 'Customer') {
        return next()
    }

    return res.status(401).send({ message: 'Unauthorize (Super Admin only)!' })
}
