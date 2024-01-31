const userModel = require('../models/userModel')
const blackListModel = require('../models/blackListModel')
const initialData = require('../database/initialData')
const bcrypt = require('bcrypt')

const login = async (request, response) => {
    const allUserData = await userModel.find()
    if (allUserData.length === 0)
    {
        const initialUser = new userModel(initialData)
        await initialUser.save()
    }
    const { email } = request.body
    try {
        const existingUser = await userModel.findOne({ email }).select('+password')
        if (!existingUser)
            return response.status(401).json({status: 'failed', code:401,  data: [], message:'Invalid email/password'})

        const validatePassword = await bcrypt.compare(`${request.body.password}`,existingUser.password)

        if (!validatePassword)
            return response.status(401).json({status: 'failed', code:401, data: [], message:'Invalid email/password'})

        let options = {
            maxAge: 20 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        }
        const token = existingUser.generateAccessJWT()
        response.cookie('SessionID', token, options)
        response.status(200).json({status: 'success', code:200, message: 'Login successful'})
    }
    catch (error) {
        response.status(500).json({status: 'error', code:500,  data: [], message: error.message})
    }
}

const logout = async(request, response) => {
    try {
        const authHeader = request.headers['cookie']
        if (!authHeader) return response.send(204).json({code:204, message:'No Content'})
        
        const cookie = authHeader.split('=')[1]
        const accessToken = cookie.split(';')[0]
        const checkIfBlacklisted = await blackListModel.findOne({ token: accessToken })
        if (checkIfBlacklisted) return response.send(204).json({code:204, message:'No Content'})

        const newBlacklist = new blackListModel({token: accessToken})
        await newBlacklist.save()

        response.setHeader('Clear-Site-Data', '"cookies"')
        response.status(200).json({ code:200, message: 'You are logged out!' })
    }
    catch (error) {
        response.status(500).json({status: 'error', code:500, message: error.message})
    }
}

module.exports = {login, logout}