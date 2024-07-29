const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    name: String,
    age: Number
})

const Customer = mongoose.model('customer', customerSchema)

module.exports = Customer