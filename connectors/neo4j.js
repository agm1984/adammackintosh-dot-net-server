import { v1 as neo4j } from 'neo4j-driver'
import getConfig from '../env/config'

const config = getConfig(process.env.NODE_ENV)
const { host, user, pwd } = config.NEO4J
const Neo4j = neo4j.driver(host, neo4j.auth.basic(user, pwd))

export default Neo4j
