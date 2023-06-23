import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: String,
  email: String
  // Other user fields
})

const Users = mongoose.model('users', userSchema)

export { Users }
