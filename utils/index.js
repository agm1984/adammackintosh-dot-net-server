import Neo4j from '../connectors/neo4j'
import { directoryTreeToObj } from './directoryTreeToObj'

/**
 * This script outputs an Object representation of a file path.
 * It will be expanded to create a graph in Neo4j that shows
 * a project's file associations and organizational structure.
 * USAGE: `babel-node index.js`
 */
const root = ('/Adam/Logical Tutorials')
directoryTreeToObj(root, (err, res) => {
  if (err) {
    throw new Error('Problem creating directory tree.')
  }
  console.log(`\nDirectory: ${root}`)
  res.forEach((r) => {
    console.log(r)
  })
})
