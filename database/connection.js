const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const {DB_URI} = require('../configuration/config')

const connectToDatabase = async() => {
    const mongoServer = await MongoMemoryServer.create()
    // const getUri = mongoServer.getUri()
    // const db = await mongoose.connect(getUri)
    const db = await mongoose.connect(DB_URI)
    console.log(`Connected successfully to the database : ${db.connection.host}`)
    return db;
}

module.exports = connectToDatabase