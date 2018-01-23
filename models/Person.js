import mongoose from 'mongoose'

const personSchema = new mongoose.Schema({
  person_status: String,
  person_memberType: String,
  person_canBeEmailed: Boolean,
  person_avatar: String,
  person_givenName: String,
  person_familyName: String,
  person_email: String,
  person_tel: String,
  person_gender: String,
  person_birthday: String,
  person_location: String,
  person_bio: String,
  person_encryptedPassword: String,
  person_serialNumber: String,
})

export default mongoose.model('Person', personSchema)
