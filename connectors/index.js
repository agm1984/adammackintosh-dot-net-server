import mongoose from 'mongoose'
import Neo4J from './neo4j'
import Mongoose from './mongoose'
import MongooseModels from '../models'
import fieldValidators from '../validators'

const db = new Map([
  ['Neo4J', Neo4J],
  ['Mongoose', Mongoose],
  ['MongooseModels', MongooseModels],
  ['MongooseDriver', mongoose],
  ['fieldValidators', fieldValidators],
])

export default db
