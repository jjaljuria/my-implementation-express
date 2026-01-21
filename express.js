const http = require('node:http');
const { json } = require('node:stream/consumers');
const { join } = require('node:path');

class Router{
    _handlers = []
    get(url, callback){
        this._handlers.push({
            url,
            method: 'GET',
            callback
        })
    }


    post(url, callback){
        this._handlers.push({
            url,
            method: 'POST',
            callback
        })
    }

    get handlers(){
        return this._handlers
    }
}


class Express{
    router = null
    middlewares = []
    server = null

    
    constructor(){
        this.server = http.createServer()
        this.router = new Router()
    }
    
    use(...args){

        if(args.length > 1){
            
            if(typeof(args[0]) === 'string' && args[1] instanceof Router){
                const path = args[0]
                const router = args[1]
                this.router.handlers.push(...router.handlers.map(layer => ({
                    url: join(path,layer.url),
                    method: layer.method,
                    callback: layer.callback
                })))
                return
            }
        }

        const callback = args[0]
        if(callback instanceof Router){
            this.router.handlers.push(...callback.handlers)
            return
        }
        this.middlewares.push(callback)
    }



    listen(port, callback){


        this.server.on('request',(req,res)=>{
            // Add at request
            res.json = (data) =>{
                res.setHeader('Content-Type','application/json')
                res.end(JSON.stringify(data))
            }

            res.send = (data) =>{
                res.end(data)
            }


            let i = 0
            const next = () => {
                const middleware = this.middlewares[i++]
                if(middleware){
                    return middleware(req,res,next)
                }

                for(const layer of this.router.handlers){
                    if(layer.url === req.url && layer.method === req.method){
                        return layer.callback(req,res)
                    }
                }

                res.statusCode = 404
                res.end('Not Found')
            }

            next()
        })

        this.server.listen(port, callback)       
    }
}

function express() {
    return new Express();
}

express.json = function(){
    return async function(req,res,next){
        if(req.headers['content-type'] === 'application/json'){
            const body = await json(req)
            req.body = body
        }
        next()
    }
}

express.Router = function(){
    const router = new Router();
    return router;
}

module.exports = express;