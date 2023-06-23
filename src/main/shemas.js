import mongoose from 'mongoose'

// Define your schemas and models
const Schema = mongoose.Schema
const mySchema = new Schema({
  // Define your schema fields here
})
const userSchema = new mongoose.Schema({
  username: String,
  email: String
  // Other user fields
})

const MyModel = mongoose.model('MyModel', mySchema)
const Users = mongoose.model('users', userSchema)

export { MyModel, Users }
