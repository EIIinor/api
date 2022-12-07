const port = process.env.PORT || 1234
const express = require('express')
const cors = require ('cors')
const bodyParser = require('body-parser')
const app = express()

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json())

const productsController = require('./controllers/productsController')
app.use('/api/products', productsController)


app.listen(port, () => console.log('WebApi is running on http://localhost:${port}'))