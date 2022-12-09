require('dotenv').config()

const port = process.env.WEBAPI_PORT || 1234
const initMongoDB = require('./mongodb_server')
const express = require('express')
const cors = require ('cors')
const bodyParser = require('body-parser')
const app = express()


// middleware
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json())


// routes
const productsController = require('./controllers/productsController')
app.use('/api/products', productsController)
// app.use('/api/authentucation', require('./controllers/authenticationController'))


// initialize
initMongoDB()
app.listen(port, () => console.log('WebApi is running on http://localhost:${port}'))