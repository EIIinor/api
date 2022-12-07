const express = require('express')
const controller = express.Router()
let products = require('../data/simulated_database')


controller.param("tag", (req, res, next, tag) => {
    req.products = products.filter( x => x.tag == tag)
    next()
})

controller.param("articleNumber", (req, res, next, articleNumber) => {
    req.product = products.find(product => product.articleNumber == articleNumber)
    next()
})


controller.route('/')
.post((request, response) => {
    let product = {
        id: (products[products.length -1])?.id > 0 ? (products[products.length -1])?.id +1 :1,
        articleNumber: request.body.articleNumber,
        name: request.body.name,
        price: request.body.price,
        category: request.body.category,
        imageName: request.body.imageName,
        description: request.body.description
    }
    products.push(product)
    response.status(201).json(product)
})
.get((request, response) => {
    response.status(200).json(products)
})


controller.route("/:tag")
.get((request, response) => {
    if(request.products.length === 0)
        response.status(404).json()
    else
        response.status(200).json(request.products)
})

controller.route("/:tag/:take")
.get((request, response) => {
    let list = []
    
    for (let i = 0; i < Number(request.params.take); i++)
        list.push(request.products[i])

    response.status(200).json(list)
})

controller.route("/details/:articleNumber")
.get((request, response) => {
    if(request.product != undefined)
        response.status(200).json(request.product)
    else
        response.status(404).json()
})

.put((request, response) => {
    if(request.product != undefined) {
        products.forEach(product => {
            if (product.articleNumber == request.product.articleNumber) {
                product.articleNumber = request.body.articleNumber ? request.body.articleNumber : product.articleNumber
                product.name = request.body.name ? request.body.name : product.name
                product.price = request.body.price ? request.body.price : product.price
                product.category = request.body.category ? request.body.category : product.category
                product.imageName = request.body.imageName ? request.body.imageName : product.imageName
                product.description = request.body.description ? request.body.description : product.description
            }
        })
        response.status(200).json(request.product)
    }
    else
    response.status(404).json()
})

.delete((request, response) => {
    if(request.product != undefined) {
        products = products.filter(product => product.articleNumber !== request.product.articleNumber)
        response.status(204).json()
    }
    else
        response.status(404).json()
})




module.exports = controller