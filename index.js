const { json } = require('node:stream/consumers')
const http = require('node:http')
const Router = require('./lib/router')
const Express = require('./lib/core')

function express () {
  const router = new Router()
  const server = http.createServer()

  return new Express({ server, router })
}

express.json = function () {
  return async function (req, res, next) {
    if (req.headers['content-type'] === 'application/json') {
      const body = await json(req)
      req.body = body
    }
    next()
  }
}

express.Router = function () {
  const router = new Router()
  return router
}

express.static = function (root) {
  const { stat, createReadStream } = require('node:fs')
  const { join } = require('node:path')

  return function (req, res, next) {
    const filePath = join(root, req.url)
    stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        return next()
      }
      const stream = createReadStream(filePath)
      stream.pipe(res)
    })
  }
}

module.exports = express
