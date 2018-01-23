import mongoose from 'mongoose'
import getConfig from '../env/config'

mongoose.Promise = global.Promise
const config = getConfig(process.env.NODE_ENV)
const {
  user, pwd, host, port, db,
} = config.MONGODB
const URI = `mongodb://${user}:${pwd}@${host}:${port}/${db}`
const Mongoose = mongoose.connect(URI, {
  useMongoClient: true,
})

export default Mongoose
