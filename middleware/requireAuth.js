const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const requireAuth = async (req, res, next) => {
    // verify authentication
    const { authorization } = req.headers 

    if(!authorization) {
        return res.status(401).json({error: 'Authorization token required'})
    } 
    // we will get authorization like this: "Bearer hjbhjbjhb.asjhbca7jhchjbd7.dkjbakjbjk"\
    // but we will split this on space and get the second part i.e token
    const token = authorization.split(' ')[1]

    try {
        const {_id} = jwt.verify(token, process.env.SECRET)
        req.user = await User.findOne({ _id }).select('_id')
        next()

    } catch (error) {
        console.log(error)
        res.status(401).json({error: 'Request not authorized'})
    }

}

module.exports = requireAuth