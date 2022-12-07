const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    id: {type: mongoose.Schema.Types.ObjectId},
    imageName: {type: String},
    name: {type: String, required:true},    
    category: {type: String}, 
    description: {type: String}, 
    price: {type: Number, required:true}, 
    rating: {type: Number},
    tag: {type: String}, 
})

module.exports = mongoose.model("products", productSchema)