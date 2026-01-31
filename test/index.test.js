import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'
import express from '../index.js'

describe('Express (index)', () => {
  test('express() returns an app with basic methods', () => {
    const app = express()
    assert.ok(app.listen)
    assert.ok(app.use)
    assert.ok(app.router)
  })

  test('express.json middleware parses JSON request body', async () => {
    const app = express()
    app.use(express.json())
    app.post('/json', (req, res) => res.json(req.body))

    app.listen(0)
    const port = app.server.address().port
    const url = `http://localhost:${port}/json`
    const payload = { hello: 'world' }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await res.json()
    assert.deepEqual(data, payload)
    // close server to avoid keeping event loop open
    app.server.close()
  })

  test('express.static middleware serves files when req.url has no leading slash', async () => {
    const fixtures = resolve('test', 'fixtures')
    mkdirSync(fixtures, { recursive: true })
    const filePath = resolve(fixtures, 'hello.txt')
    writeFileSync(filePath, 'Hello Static')
    const app = express()
    app.use(express.static(fixtures))

    app.listen(0)
    const port = app.server.address().port
    const url = `http://localhost:${port}/hello.txt`

    const res = await fetch(url)
    const data = await res.text()
    assert.strictEqual(data, 'Hello Static')

    // close server to avoid keeping event loop open
    app.server.close()

    rmSync(fixtures, { recursive: true, force: true })
  })
})
