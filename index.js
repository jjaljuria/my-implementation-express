import { json } from 'node:stream/consumers'
import http from 'node:http'
import { stat, createReadStream } from 'node:fs'
import { join } from 'node:path'
import Router from './lib/router.js'
import Express from './lib/core.js'

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

export default express
