import mongoose from 'mongoose'

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/dentalClinicApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// Check if the connection is successful

const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', () => {
  console.log('Connected to MongoDB')
})

export default db
