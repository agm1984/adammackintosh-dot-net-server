/**
 * GraphQL requests that require the user to be signed in, ie: have a valid JWT
 * are checked with this function.
 * @param {Object} context GraphQL Context Value
 */
const isAuthenticated = (context) => {
  const { person } = context
  if (!person) {
    throw new Error('You are not logged in.')
  }
  return null
}

export default isAuthenticated
