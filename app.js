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

const welcome = 'Welcome to the CRM!'
const actions = 
`What would you like to do?
1. Create a new customer 
2. View all customers
3. Update a customer
4. Delete a customer
5. Quit this session

Enter the number of the action you would like to see:`


/* --------------------------------------- Flow of Events ---------------------------------------*/

const runQueries = async () => {
    let quit = false
    console.log(`${welcome}`)
    while (!quit) {
        let action = await getAction()
        switch (action) {
            case `1`:
                const name = prompt("What is the customer's name?")
                const age = prompt("What is the customer's age?")
                await createACustomer({ name, age })
                break
            case '2':
                await showAllCustomerData()
                break
            case '3':
                await showAllCustomerData()
                const updateID = prompt('Copy and paste your customers ID:')
                const newName = prompt("What is your customer's new name?")
                const newAge = prompt("What is your customer's new age?")
                await updateACustomer(updateID, { name: newName, age: newAge })
                break
            case `4`:
                await showAllCustomerData()
                const deleteID = prompt('Copy and paste the ID of the customer you would like to delete:')
                await deleteACustomer(deleteID)
                break
            case `5`:
                console.log('Exiting...')
                await quitSession()
                quit = true
                break
            default:
                console.log('Hmm, do not understand this command.')
                break
        }
    }
}
/* --------------------------------------- Functions ---------------------------------------*/

async function getAction() {
    return prompt(`${actions}`)
}

async function showAllCustomerData() {
    const customers = await viewAllCustomers()
    console.log('Here are all the customers:')
    customers.forEach((customer) => {
        console.log(`id: ${customer._id} Name: ${customer.name} Age: ${customer.age}`)
    })
    await new Promise(res => setTimeout(res, 500))
}

async function createACustomer(customer) {
    await Customer.create(customer)
    await new Promise(res => setTimeout(res, 500))
}

async function viewAllCustomers() {
    const response = await Customer.find()
    await new Promise(res => setTimeout(res, 500))
    return response
}

async function updateACustomer(id, updates) {
    await Customer.findByIdAndUpdate(id,
        updates,
        { new: true }
    )
    await new Promise(res => setTimeout(res, 500))
}

async function deleteACustomer(id) {
    await Customer.findByIdAndDelete(id)
    await new Promise(res => setTimeout(res, 500))
}

async function quitSession() {
    await mongoose.connection.close()
    await new Promise(res => setTimeout(res, 500))
}