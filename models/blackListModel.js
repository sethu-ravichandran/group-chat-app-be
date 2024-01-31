const mongoose = require('mongoose')

const blackListSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
            ref: 'users',
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model.blackListSchema ||  mongoose.model('blacklist', blackListSchema)