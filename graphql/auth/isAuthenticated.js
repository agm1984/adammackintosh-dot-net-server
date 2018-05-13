/**
 * GraphQL requests that require the user to be signed in, ie: have a valid JWT
 * are checked with this function.
 * @param {Object} context GraphQL Context Value
 */
const isAuthenticated = (context) => {
  // console.log('CONTEXT', context)
  const { person } = context
  if (!person) return false
  return true
}

export default isAuthenticated
