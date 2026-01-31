import { describe, test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import Router from '../lib/router.js'

describe('Router', () => {
  let router

  beforeEach(() => {
    router = new Router()
  })

  test('should add handlers for common methods', () => {
    router.get('/a', () => {})
    router.post('/b', () => {})
    router.put('/c', () => {})
    router.delete('/d', () => {})

    const methods = router.handlers.map(h => h.method)
    assert.equal(router.handlers.length, 4)
    assert.deepEqual(methods, ['GET', 'POST', 'PUT', 'DELETE'])
  })
})
