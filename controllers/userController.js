const authenticateUser = async(request, response) => {
    response.status(200).json({status: 'success', code:200, message: 'Welcome to User Dashboard'})
}

module.exports = {authenticateUser}