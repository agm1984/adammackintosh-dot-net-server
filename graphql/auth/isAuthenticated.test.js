import isAuthenticated from './isAuthenticated'

const rejectContext = {}
const passContext = {
  settings: {},
  person: '2346e9278add4bce821e861b72f69e76',
  db: new Map(),
}

test('Authentication Checker loads', () => {
  expect(isAuthenticated).toBeDefined()
})

test('Authentication Checker rejects missing person', () => {
  const reject = isAuthenticated(rejectContext)
  expect(reject).toBeFalsy()
})

test('Authentication Checker permits found person', () => {
  const pass = isAuthenticated(passContext)
  expect(pass).toBeDefined()
})
