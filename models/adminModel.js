const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const adminSchema = new mongoose.Schema(
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

adminSchema.pre('save', (next) => {
    const admin = this;

    if (!admin.isModified('password')) return next()
    bcrypt.genSalt(10, (error, salt) => {
        if (error) return next(error)

        bcrypt.hash(admin.password, salt, (error, hash) => {
            if (error) return next(error)

            admin.password = hash
            next()
        })
    })
})

module.exports = mongoose.model.admin || mongoose.model("admin", adminSchema)