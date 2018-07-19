const fs = require('fs')
const path = require('path')

/**
 * This utility function recursively creates an Object respresentation of a file path.
 * @param {*} dir Directory to parse
 * @param {*} done onComplete Callback
 */
// eslint-disable-next-line
export const directoryTreeToObj = (dir, done) => {
  const results = []
  return fs.readdir(dir, (readError, list) => {
    if (readError) {
      return done(readError)
    }
    let pending = list.length
    if (!pending) {
      return done(null, {
        name: path.basename(dir),
        type: 'folder',
        children: results,
      })
    }
    return list.forEach((result) => {
      const file = path.resolve(dir, result)
      fs.stat(file, (statError, stat) => {
        if (stat && stat.isDirectory()) {
          directoryTreeToObj(file, (err, res) => {
            results.push({
              name: path.basename(file),
              type: 'folder',
              children: res,
            })
            pending -= 1
            if (!pending) {
              done(null, results)
            }
          })
        } else {
          results.push({
            type: 'file',
            name: path.basename(file),
          })
          pending -= 1
          if (!pending) {
            done(null, results)
          }
        }
      })
    })
  })
}
