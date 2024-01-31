const { validationResult } = require('express-validator')

const validate = (request, response, next) => {
    const errors = validationResult(request)

    if (!errors.isEmpty())
    {
        let errorObject = {}
        errors.array().map((error) => (errorObject[error.param] = error.msg))
        return response.status(422).json({error:errorObject})
    }
    next()
}

module.exports = validate