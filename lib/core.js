import { join } from 'node:path'
import Router from './router.js'

class Express {
  router = null
  middlewares = []
  server = null

  constructor ({ server, router }) {
    this.server = server
    this.router = router

    Object.getOwnPropertyNames(Router.prototype).forEach(method => {
      if (method !== 'constructor' && !method.startsWith('_')) {
        this[method] = (...args) => {
          this.router[method](...args)
        }
      }
    })
  }

  use (...args) {
    if (args.length === 0) {
      throw new Error('El método use requiere al menos un argumento.')
    }

    if (args.length > 1) {
      if (typeof args[0] !== 'string') {
        throw new TypeError('El primer argumento debe ser una cadena si se proporcionan múltiples argumentos.')
      }
      if (!(args[1] instanceof Router)) {
        throw new TypeError('El segundo argumento debe ser una instancia de Router.')
      }

      const path = args[0]
      const router = args[1]
      this.router.handlers.push(...router.handlers.map(layer => ({
        url: join(path, layer.url),
        method: layer.method,
        callback: layer.callback
      })))
      return
    }

    const callback = args[0]
    if (!(callback instanceof Router) && typeof callback !== 'function') {
      throw new TypeError('El argumento debe ser una función o una instancia de Router.')
    }

    if (callback instanceof Router) {
      this.router.handlers.push(...callback.handlers)
      return
    }

    this.middlewares.push(callback)
  }

  listen (port, callback) {
    this.server.on('request', (req, res) => {
      // Add at request
      res.json = (data) => {
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(data))
      }

      res.send = (data) => {
        res.end(data)
      }

      let i = 0
      const next = () => {
        const middleware = this.middlewares[i++]
        if (middleware) {
          return middleware(req, res, next)
        }

        for (const layer of this.router.handlers) {
          if (layer.url === req.url && layer.method === req.method) {
            return layer.callback(req, res)
          }
        }

        res.statusCode = 404
        res.end('Not Found')
      }

      next()
    })

    return this.server.listen(port, callback)
  }
}

export default Express
