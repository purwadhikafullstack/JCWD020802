const jwt = require('jsonwebtoken')

export const verifyToken = (req, res, next) => {
    try {
        let token = req.headers.authorization
        if (!token) {
            return res.status(401).send({
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
