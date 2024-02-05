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

const updateUser = async(request, response) => {
    const userId = request.body._id
    const {firstName, lastName, email, password, role} = request.body
    try{
        const userToBeUpdated = await userModel.findById(userId)
        if (!userToBeUpdated)
        {
            return response.status(404).json({status: 'failed', code: 404, data: [], message: "User not found"}) 
        }

        const newUser = new userModel({firstName, lastName, email, password, role})

        userToBeUpdated.firstName = newUser.firstName || userToBeUpdated.firstName
        userToBeUpdated.lastName = newUser.lastName || userToBeUpdated.lastName
        userToBeUpdated.email = newUser.email || userToBeUpdated.email
        userToBeUpdated.role = newUser.role || userToBeUpdated.role
        userToBeUpdated.password = newUser.password || userToBeUpdated.password

        const updatedUser = await userToBeUpdated.save()
        const {password:userPassword, role:userRole , ...user_data } = updatedUser._doc
        response.status(201).json({ status: 'success', code:201, data: [user_data], message:'Account created, successfully'})
    } catch (error) {
        response.status(500).json({status: 'error', code:500, data: [], message: error.message,})
    }
}

module.exports = {authenticateAdmin, createUser, updateUser}