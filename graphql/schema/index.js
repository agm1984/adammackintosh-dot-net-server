import { makeExecutableSchema } from 'graphql-tools'
import typeDefs from './typeDefs'
import resolvers from './resolvers'

/**
 * makeExecutableSchema combines the typeDefs and resolvers into one file,
 * which is then loaded into GraphQL upon server instantiation.
 */
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

export default schema
