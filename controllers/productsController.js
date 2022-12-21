const { json } = require('express')
const express = require('express')
const { update } = require('../schemas/productSchema')
const productSchema = require('../schemas/productSchema')
const controller = express.Router()
// let products = require('../data/simulated_database')



// unsecured routes

controller.route('/').get(async (req, res) => {
    const products = []
    const list = await productSchema.find()
    if (list) {
        for(let product of list) {
            products.push({
                articleNumber: product._id,
                name: product.name ,
                descpiption: product.descpiption,
                price: product.price,
                category: product.category,
                tag: product.tag,
                imageName: product.imageName,
                rating: product.rating
            })
        }
        res.status(200).json(products)
    } else
        res.status(400).json()
})

controller.route('/:tag').get(async (req, res) => {
    const products = []
    const list = await productSchema.find({ tag: req.params.tag })
    if (list) {
        for(let product of list) {
            products.push({
                articleNumber: product._id,
                name: product.name ,
                descpiption: product.descpiption,
                price: product.price,
                category: product.category,
                tag: product.tag,
                imageName: product.imageName,
                rating: product.rating
            })
        }
        res.status(200).json(products)
    } else
        res.status(400).json()
})

controller.route('/:tag/:take').get(async (req, res) => {
    const products = []
    const list = await productSchema.find({ tag: req.params.tag }).limit(req.params.take)
    if (list) {
        for(let product of list) {
            products.push({
                articleNumber: product._id,
                name: product.name ,
                descpiption: product.descpiption,
                price: product.price,
                category: product.category,
                tag: product.tag,
                imageName: product.imageName,
                rating: product.rating
            })
        }
        res.status(200).json(products)
    } else
        res.status(400).json()
})

controller.route('/product/details/:articleNumber').get(async (req, res) => {
    const product = await productSchema.findById(req.params.articleNumber)
    if (product) {
        res.status(200).json({
            articleNumber: product._id,
            name: product.name ,
            descpiption: product.descpiption,
            price: product.price,
            category: product.category,
            tag: product.tag,
            imageName: product.imageName,
            rating: product.rating
        })
    } else
        res.status(404).json()
})



// secured routes

controller.route('/').post(async (req, res) => {
    const { name, description, price, category, tag, imageName, rating } = req.body

    if (!name || !price) 
        res.status(400).json({text: 'name and price is required.'})

    const item_exists = await productSchema.findOne({name})
    if (item_exists)
        res.status(409).json({text: `a product with the same name already exist.`})
    else {
        const product = await productSchema.create({
            name,
            description,
            price,
            category,
            tag,
            imageName,
            rating
        })
        if (product)
            res.status(201).json({text: `a product was created with article number: ${product._id}`})
        else 
            res.status(400).json({text:'something went wrong.'})
    }
})


controller.route('/:articleNumber').delete(async (req, res) => {
    if(!req.params.articleNumber)
        res.status(400).json({text:'no article number was specified'})
    else {
        const item = await productSchema.findById(req.params.articleNumber,)
        if (item) {
            await productSchema.deleteOne(item,  {new:true})
            res.status(200).json({text: `product with article number ${req.params.articleNumber} was deleted`})
        } else {
            res.status(404).json({text: `product with article number ${req.params.articleNumber} was not found`})
        }
    }
})


controller.route('/:articleNumber').put(async (req, res) => {
    const { articleNumber, name, descpiption, price, tag, imageName, category, rating } = req.body
    if(!req.params.articleNumber)
        res.status(400).json({text:'no article number was specified'})

    else {
        const product = await productSchema.findByIdAndUpdate(req.params.articleNumber, req.body, {new:true})

        if (!product) {
            return res.status(404).json({text: ' product not found '})
        }
            res.status(200).json(product)
    }
})




//     const updatedProduct = await productSchema.findByIdAndUpdate(req.params.articleNumber, updatedProduct, {new:true})
//         const productExist = await productSchema.findById(req.params.articleNumber)
//         if (productExist) {
//             const updateProduct = await productSchema.updateOne({_id: req.params.articleNumber}, updatedProduct)
//             if (updateProduct)
//                 res.status(200).json({text: 'updated'})
//             else 
//                 res.status(400).json({text: 'something went wrong'})
//         }
//         return (updatedProduct)
// })




//     const id = req.params.articleNumber
//     const updates = req.body
//     const product = await productSchema.findByIdAndUpdate(id, updates, { new:true })
    
//         if (product) 
//             res.status(200).json(product)
//         else 
//             res.status(404).json({text: 'something went wrong'})

// })



module.exports = controller






/*

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

*/