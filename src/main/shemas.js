import { Schema, model } from 'mongoose'

const userSchema = new Schema({
  username: String,
  email: String
  // Other user fields
})

const NewPatientSchema = new Schema({
  dateTransact: Date,
  patientName: String,
  patientAge: Number,
  patientGender: String,
  placeOfBirth: String,
  nationality: String,
  civilStatus: String,
  occupation: String,
  address: String,
  personalContact: Number,
  emergencyToContact: String,
  emergencyRelation: String,
  emergencyToContactNo: Number,
  medicalHistory: String
})

const SaleRecordSchema = new Schema({
  patientName: String,
  dateTransact: Date,
  treatmentRendered: String,
  treatmentType: String,
  amountPaid: Number
})

const Users = model('users', userSchema)
const NewPatient = model('new-patient', NewPatientSchema)
const NewSale = model('sales-record', SaleRecordSchema)

export { Users, NewPatient, NewSale }
