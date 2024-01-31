const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema(
    {
        userName : {
            type : String,
            required : [true, 'Username is a mandatory field'],
            max : 25,
        },
        password : {
            type : String,
            required : [true,'Password is a mandatory field'],
            select : false,
            max : 25,
        }
    },
    {
        timestamps : true
    }
)

userSchema.pre('save', (next) => {
    const user = this;

    if (!user.isModified('password')) return next()
    bcrypt.genSalt(10, (error, salt) => {
        if (error) return next(error)

        bcrypt.hash(user.password, salt, (error, hash) => {
            if (error) return next(error)

            user.password = hash
            next()
        })
    })
})

module.exports = mongoose.model.admin || mongoose.model("admin", userSchema)