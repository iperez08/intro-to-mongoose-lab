const prompt = require('prompt-sync')();
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const Customer = require('./models/customer')

const connect = async () => {
    await mongoose.connect(process.env.MONGODB_URI)
    await runQueries()
    await mongoose.disconnect()
    process.exit()
}
connect()

/* --------------------------------------- Messages ---------------------------------------*/

const welcome = 'Welcome to the CRM! What would you like to do?'
const actions = `

1. Create a new customer 
2. View all customers
3. Update a customer
4. Delete a customer
5. Quit this session

Enter the number of the action you would like to see:
`

/* --------------------------------------- Flow of Events ---------------------------------------*/

const runQueries = async () => {
    let quit = false
    while (!quit) {
        const landingPage = prompt(`${welcome}${actions}`)

        switch (landingPage) {
            case `1`:
                console.log('What is the new customers name?')
                const name = prompt()
                console.log('What is the new customers age?')
                const age = prompt()
                const newCustomer = await createACustomer({ name, age })
                console.log(`You created a new customer: ${newCustomer}`)
                break
            case '2':
                await showAllCustomerData()
                break
            case '3':
                await showAllCustomerData()
                console.log('Enter your customers ID:')
                const updateID = prompt()
                console.log('Would you like to update the name or age?')
                const choice = prompt()
                console.log(`What is your customers new ${choice}?`)
                const newInfo = prompt()
                const updatedCustomer = await updateACustomer(updateID, { [choice]: newInfo })
                console.log(`Here is your custumers new information.
            id: ${updatedCustomer._id} Name: ${updatedCustomer.name} Age: ${updatedCustomer.age}
            `)
                break
            case `4`:
                await showAllCustomerData()
                console.log('Enter the ID of the customer you would like to delete?')
                const deleteID = prompt()
                const deletedCustomer = await deleteACustomer(deleteID)
                console.log(`Here is the customer you deleted
            id: ${deletedCustomer._id} Name: ${deletedCustomer.name} Age: ${deletedCustomer.age}
            `)
                break
            case `5`:
                console.log('Exiting...')
                await quitSession()
                quit = true
                break
            default:
                console.log('Hmm, do not understand this command')

        }
    }
}
/* --------------------------------------- View Function ---------------------------------------*/

async function showAllCustomerData() {
    const customers = await viewAllCustomers()
    console.log('Here are all the customers:')
    customers.forEach((customer) => {
        console.log(`id: ${customer._id} Name: ${customer.name} Age: ${customer.age}`)
    })
}

/* --------------------------------------- Customers ---------------------------------------*/

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

/* --------------------------------------- Queries ---------------------------------------*/

async function createACustomer(customer) {
    const response = await Customer.create(customer)
    return response
}

async function viewAllCustomers() {
    const response = await Customer.find()
    return response
}

async function updateACustomer(id, updates) {
    const response = await Customer.findByIdAndUpdate(id,
        updates,
        { new: true }
    )
    return response
}

async function deleteACustomer(id) {
    const response = await Customer.findByIdAndDelete(id)
    return response
}

async function quitSession() {
    await mongoose.connection.close()
}