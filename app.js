const express = require('express')
const app = express()
const {PORT} = require('./configuration/config')

const morgan = require('morgan')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const connect = require('./database/connection')
const adminRouter = require('./routes/adminRoute')
const userRouter = require('./routes/userRoute')

app.use(morgan('tiny'))
app.use(cors())
app.disable('x-powered-by')
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get('/', (request, response) => {
    response.status(200).json({message:`API is running 🥳`})
})

app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/user', userRouter)

connect()
    .then( () => {
        try{
            app.listen(PORT, () => {
                console.log(`Server started running at http://localhost:${PORT}/`)
            })
        }
        catch(error)
        {
            console.log(`Can't connect to the server : ${error}`)
        }
    })
    .catch(error => {
        console.log(`Error while connecting to database : ${error}`)
    })


// SwaggerUI
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')

const options = {
    definition: {
    openapi: '3.0.0',
    info: {
        title: 'Group Chat App',
        version: '1.0.0',
        description: 'An API for a (riktam) group chat app ',
    },
    servers:[
        {
            api:'http://localhost:3500/'
        }
    ]
    },
    apis: ['./routes/*.js'], 
};

const specs = swaggerJsdoc(options)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
    

