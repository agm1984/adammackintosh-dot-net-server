import Neo4j from './neo4j'

test('Neo4j driver connects', () => {
  expect(Neo4j).toBeDefined()
})

test('Neo4j test query works', async () => {
  const session = Neo4j.session()
  const testQuery = await session.run('RETURN 1337 AS test')
  session.close()
  const result = testQuery.records[0].get('test').low
  expect(result).toBe(1337)
})

test('Neo4j driver closes without hanging thread', () => {
  Neo4j.close()
})
