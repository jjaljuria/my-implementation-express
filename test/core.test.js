import { describe, test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import http from 'node:http'
import Router from '../lib/router.js'
import Express from '../lib/core.js'

describe('Express', () => {
  let server
  let express

  beforeEach(() => {
    server = http.createServer()
    const router = new Router()
    express = new Express({ server, router })
  })

  afterEach(() => {
    server.close()
  })

  test('should initialize with server and router', () => {
    assert.ok(express.server)
    assert.ok(express.router)
  })

  test('should add middleware with use()', () => {
    const middleware = (req, res, next) => next()
    express.use(middleware)
    assert.equal(express.middlewares.length, 1)
    assert.equal(express.middlewares[0], middleware)
  })

  test('should add routes with use(path, router)', () => {
    const subRouter = new Router()
    subRouter.get('/test', (req, res) => res.end('Test'))
    express.use('/sub', subRouter)

    assert.equal(express.router.handlers.length, 1)
    assert.equal(express.router.handlers[0].url, '/sub/test')
  })

  test('should handle requests with listen()', async (t) => {
    express.listen(0)
    const port = server.address().port
    const url = `http://localhost:${port}`
    express.use((req, res, next) => {
      res.setHeader('X-Test', 'true')
      next()
    })

    express.get('/', (req, res) => {
      res.end('Hello World')
    })

    const response = await fetch(url)
    assert.strictEqual(response.headers.get('x-test'), 'true')
    assert.strictEqual(await response.text(), 'Hello World')
  })

  test('should return 404 for unknown routes', async () => {
    express.listen(0)
    const port = server.address().port
    const url = `http://localhost:${port}/unknown`
    try {
      const res = await fetch(url)

      assert.strictEqual(res.status, 404)
    } catch (err) {
      assert.fail('Request failed: ' + err.message)
    }
  })
})
