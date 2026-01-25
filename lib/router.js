class Router {
  _handlers = []

  _addHandler (url, method, callback) {
    this._handlers.push({
      url,
      method,
      callback
    })
  }

  get (url, callback) {
    this._addHandler(url, 'GET', callback)
  }

  post (url, callback) {
    this._addHandler(url, 'POST', callback)
  }

  put (url, callback) {
    this._addHandler(url, 'PUT', callback)
  }

  delete (url, callback) {
    this._addHandler(url, 'DELETE', callback)
  }

  get handlers () {
    return this._handlers
  }
}

export default Router
