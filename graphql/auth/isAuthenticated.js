export function isAuthenticated({ person }) {
  try{
    if (!person) throw [`isAuthenticated`, `You are not logged in.`]
    return
  } catch (e) {
    throw e
  }
}