import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import sniffer from 'request-ip'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import jwt from 'jsonwebtoken'
import schema from './graphql/schema'
import Neo4J from './connectors/neo4j'
import Mongoose from './connectors/mongoose' // eslint-disable-line
import MongooseModels from './models'
import fieldValidators from './validators'
import getConfig from './env/config'

const app = express()

// ENVIRONMENT CONFIG
const config = getConfig(process.env.NODE_ENV)
if (process.env.NODE_ENV !== 'production') {
  process.on('unhandledRejection', (reason, promise) => {
    console.log(
      'Unhandled Rejection at:', promise,
      'Reason:', reason,
    )
  })
  process.on('uncaughtException', (error) => {
    console.error(error)
    process.exit(1)
  })
}
const db = new Map([
  ['Neo4J', Neo4J],
  ['MongooseModels', MongooseModels],
  ['fieldValidators', fieldValidators],
])

// MIDDLEWARE
app.use(cors(config.CORS_OPTIONS))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// AUTHENTICATION
app.use(async (req) => {
  try {
    const token = req.headers.authorization
    const { person } = await jwt.verify(token, config.SECRET)
    req.person = person
    return req.next()
  } catch (e) {
    return req.next()
  }
})

// GRAPHQL
app.use('/graphql', bodyParser.json(), graphqlExpress((req) => {
  console.log('NEW GRAPHQL REQUEST:', req.body)
  const context = {
    settings: {
      ENV: process.env.NODE_ENV,
      PORT: config.PORT,
      SECRET: config.SECRET,
    },
    person: req.person,
    db,
  }
  return {
    schema,
    context,
    rootValue: null,
    formatError: error => ({
      message: error.message,
      locations: error.locations,
      stack: error.stack,
      path: error.path,
    }),
    debug: true,
  }
}))
app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}))

// EVENT LOGGER
app.all('*', async (req, res, next) => {
  // ADD REQUEST COUNTERS HERE: req.counter += 1
  console.log(`
    -- Person hitting route --
    HTTP METHOD: ${req.method},
    ORIGINAL URL: ${req.originalUrl},
    ROUTE: ${req.route.path},
    URL: ${req.url},
    USER AGENT: ${req.headers['user-agent']},
    USER IP: ${sniffer.getClientIp(req)}
    PERSON: ${req.person}
  `)
  return next()
})

// SPLAT ROUTE
app.get('*', async (req, res, next) => res.status(404).render('error/404'))

// ERRORS
app.use(async (err, req, res, next) => {
  res.status(500).render('error/500')
  throw err
})

// START
app.listen(config.PORT, () => {
  console.log('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓')
  console.log(`┃  GRAPHQL  ENDPOINT: http://localhost:${config.PORT}/graphql                    ┃`)
  console.log(`┃  GRAPHIQL ENDPOINT: http://localhost:${config.PORT}/graphiql                   ┃`)
  console.log('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛')
})

