import Neo4J from './neo4j'

const driver = Neo4J.getDriver()

test('Neo4j driver connects', () => {
  expect(driver).toBeDefined()
})

test('Neo4j test query works', async () => {
  const session = driver.session()
  const testQuery = await session
    .run(`
      RETURN 1337 AS test
    `)
    .then((result) => {
      session.close()
      return result.records[0].get('test').low
    })
    .catch((error) => {
      session.close()
      return false
    })
  expect(testQuery).toBe(1337)
})

test('Neo4j Driver closes', () => {
  driver.close()
  expect(driver._openSessions['0']._ch._open).toBeFalsy()
})
