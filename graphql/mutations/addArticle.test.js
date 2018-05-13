import addArticle from './addArticle'
import db from '../../connectors'

const root = {}
const noArgs = {}
const validArgs = {
  article_status: 'Active',
  article_title: 'Test Article',
  article_plainText: 'Test Article',
  article_content: 'Test Article',
  article_authorSerialNumber: '2346e9278add4bce821e861b72f69e76',
  article_tags: 'test1,test2,test3',
}
const noContext = {}
const invalidContext = {
  settings: {},
  person: undefined,
  db,
}
const validContext = {
  settings: {},
  person: '2346e9278add4bce821e861b72f69e76',
  db,
}

test('addArticle mutation loads', () => {
  expect(addArticle).toBeDefined()
})

test('addArticle mutation rejects missing DB', async () => {
  try {
    await addArticle(root, noArgs, noContext)
  } catch (e) {
    expect(e.message).toMatch('Cannot read property \'get\' of undefined')
  }
})

test('addArticle mutation rejects invalid user', async () => {
  try {
    await addArticle(root, noArgs, invalidContext)
  } catch (e) {
    expect(e.message).toMatch('You must be authenticated to run this query.')
  }
})

test('addArticle mutation rejects invalid fields', async () => {
  try {
    await addArticle(root, noArgs, validContext)
  } catch (e) {
    expect(e.message).toMatch('Field validation error.')
  }
})

test('Mongoose driver closes without hanging thread', () => {
  const driver = db.get('MongooseDriver')
  driver.disconnect()
})

// FUTURE:
// Test article title in use
// Test invalid author
// Test Mongo DB write failure
// Test Neo4j write failure
// Test rollback
