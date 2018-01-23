import { MongoClient } from 'mongodb'

const uri = 'mongodb://username:password@localhost:27017/dbName'
let _db

/**
 * This Mongo DB Native driver is included for archival reasons. It demonstrates
 * the best way to connect to Mongo DB using the native driver.
 * Instructions: https://stackoverflow.com/questions/24621940/how-to-properly-reuse-connection-to-mongodb-across-nodejs-application-and-module
 * @param {Function} callback Function called if DB is already connected
 */
const connectDB = async (callback) => {
  try {
    MongoClient.connect(uri, (err, db) => {
      _db = db
      return callback(err)
    })
  } catch (e) {
    throw e
  }
}
const getDB = () => _db
const disconnectDB = () => _db.close()

export default {
  connectDB,
  getDB,
  disconnectDB,
}
