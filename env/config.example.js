/**
 * The API's run-time environment can be dynamically controlled by passing
 * different environments into the object literal lookup table.
 * This is done to facilitate unit testing and to simplify server
 * instantiation code complexity.
 * @param {String} NODE_ENV Currently set run-time Environment
 */
const getConfig = (NODE_ENV) => {
  const env = {
    localhost: {
      PORT: 1337,
      SECRET: 'INSERT_SERVER_SECRET',
      CORS_OPTIONS: {
        origin: 'http://localhost:9999',
        optionsSuccessStatus: 200,
      },
      NEO4J: {
        host: 'bolt://localhost',
        user: 'insertNeo4jUser',
        pwd: 'insertNeo4jPassword',
      },
      MONGODB: {
        host: 'localhost',
        port: '27017',
        db: 'insertDBName',
        user: 'insertMongoUser',
        pwd: 'insertMongoPassword',
      },
    },
    production: {
      PORT: 1337,
      SECRET: 'INSERT_SERVER_SECRET',
      CORS_OPTIONS: {
        origin: 'http://localhost:9999',
        optionsSuccessStatus: 200,
      },
      NEO4J: {
        host: 'bolt://localhost',
        user: 'insertNeo4jUser',
        pwd: 'insertNeo4jPassword',
      },
      MONGODB: {
        host: 'localhost',
        port: '27017',
        db: 'insertDBName',
        user: 'insertMongoUser',
        pwd: 'insertMongoPassword',
      },
    },
  }
  return env[NODE_ENV]
}

export default getConfig
