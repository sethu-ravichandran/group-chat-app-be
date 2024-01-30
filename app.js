const express = require('express')
const  app = express()
const PORT = process.env.PORT || 3500

app.disable('x-powered-by')

app.get('/', (request, response) => {
    response.status(200).send(`API is running 🥳`)
})

app.listen(PORT, () => {
    console.log(`Server started running at http://localhost:${PORT}/`);
})

