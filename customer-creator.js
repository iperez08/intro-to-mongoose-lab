const mongoose = require('mongoose')
const Customer = require('./models/customer')
const dotenv = require('dotenv')
dotenv.config() 

mongoose.connect(process.env.MONGODB_URI)

const matt = Customer.create({
    name: 'Matt',
    age: 43
})

const vivienne = Customer.create({
    name: 'Vivienne',
    age: 6
})

const emre = Customer.create({
    name: 'emre',
    age: 33
})

const nuraly = Customer.create({
    name: 'Nuraly',
    age: '40'
})