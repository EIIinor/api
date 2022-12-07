const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userSchema = require('../schemas/userSchema')
const controller = express.Router()

controller.route('/signup').post(async (req, res) => {
    const {firstName, lastName, email, password} = req.body
    if (!firstName || !lastName || !email || !password)
        res.status(400).json({text: 'first name, last name, email and password is required'})
    
    const exist = await userSchema.findOne({email})
    if(exist)
        res.status(409).json({text: 'a user with the same email address already exist.'})
    else {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await userSchema.create ({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })

        if (user) {
            res.status(201).json
        }

    }
})



controller.route('/signin').post(async (req, res) => {
    
})