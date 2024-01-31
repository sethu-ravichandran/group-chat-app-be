const userModel = require('../models/userModel')
const blackListModel = require('../models/blackListModel')
const jwt = require('jsonwebtoken')
const { ACCESS_TOKEN } = require('../configuration/config')

const verify = async(request, response, next) => {
    try{
        const authHeader = request.headers['cookie']

        if (!authHeader) return response.status(401).json({code:401, message:'Token not found'})

        const cookie = authHeader.split('=')[1]
        const accessToken = cookie.split(';')[0]
        const checkIfBlacklisted = await blackListModel.findOne({ token: accessToken })
        
        if (checkIfBlacklisted)
            return response.status(401).json({ code:401, message: 'Session expired' })

        jwt.verify(cookie, ACCESS_TOKEN, async(error, decoded) => {
            if (error)
            {
                return response.status(401).json({code:401 ,message:'Session expired'})
            }
            const {id} = decoded
            const existingUser = await userModel.findById(id)
            const {password, ...data} = existingUser._doc
            request.user = data
            next()
        })    
    }
    catch (error) {
        response.status(500).json({status: 'error', code:500, message: error.message})
    }
}

const verifyAdmin = async (request, response, next) => {
    try {
        const { role } = request.user
        if (role !== 'admin') {
            return response.status(401).json({status: 'failed',code:401,message: 'Unauthorized access'})
        }
        next()
    }
    catch (error) {
        response.status(500).json({status: 'error', code: 500, message: error.message})
    }
}

module.exports = {verify, verifyAdmin}