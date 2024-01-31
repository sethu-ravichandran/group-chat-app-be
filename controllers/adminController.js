const userModel = require('../models/userModel')

const authenticateAdmin = async(request, response) => {
    response.status(200).json({status: 'success', message: 'Welcome to Admin Dashboard'})
}

const createUser = async(request, response) => {
    const { firstName, lastName, email, password, role } = request.body
    try {
        const userToBeRegistered =  new userModel({firstName, lastName, email, password, role})

        const existingUser = await userModel.findOne({ email })
        if (existingUser)
            return response.status(400).json({status: 'failed', code:400, data:[], message: 'Email id already exists'})
        
        const newUser = await userToBeRegistered.save()
        const {password:userPassword, role:userRole , ...user_data } = newUser._doc
        response.status(201).json({ status: 'success', code:201, data: [user_data], message:'Account created, successfully'})
    } catch (error) {
        response.status(500).json({status: 'error', code:500, data: [], message: error.message,})
    }
}

module.exports = {authenticateAdmin, createUser}