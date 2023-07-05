import { Schema, model } from 'mongoose'

const userSchema = new Schema({
  name: String,
  pwd: String,
  accountType: String
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

const InstallmentPatientSchema = new Schema({
  dateTransact: Date,
  patientName: String,
  patientAge: Number,
  patientAddress: String,
  treatmentRendered: String,
  treatmentType: String,
  servicePrice: Number,
  initialPay: Number,
  remainingBal: Number,
  gives: [Object]
})

const ExpenseSchema = new Schema({
  expenseName: String,
  dateTransact: Date,
  amountPaid: Number
})

const SettingSchema = new Schema({
  logoDir: String,
  appTitle: String,
  containerTitle1: String,
  containerTitle2: String,
  loginTitle: String,
  loginBgColor: String
})

const Users = model('users', userSchema)
const NewPatient = model('new-patient', NewPatientSchema)
const NewSale = model('sales-record', SaleRecordSchema)
const InstallmentPatient = model('installment-patient', InstallmentPatientSchema)
const Expenses = model('expenses', ExpenseSchema)
const SettingsData = model('settings', SettingSchema)

export { Users, NewPatient, NewSale, InstallmentPatient, Expenses, SettingsData }
