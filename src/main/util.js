/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
const { URL } = require('url')
const path = require('path')



if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 1212
  module.exports.resolveHtmlPath = (htmlFileName) => {
    const url = new URL(`http://localhost:${port}`)
    url.pathname = htmlFileName
    return url.href
  }
} else {
  module.exports.resolveHtmlPath = (htmlFileName) => {
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`
  }
}
