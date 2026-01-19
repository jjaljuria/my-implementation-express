const http = require('node:http');

class Express{
    stack = []
    middlewares = []
    server = null

    
    constructor(){
        this.server = http.createServer()
    }
    
    use(callback){
        this.middlewares.push(callback)
    }

    get(url, callback){
        this.stack.push({
            url,
            method: 'GET',
            callback
        })
    }


    post(url, callback){
        this.stack.push({
            url,
            method: 'POST',
            callback
        })
    }

    listen(port, callback){


        this.server.on('request',(req,res)=>{
            
            let i = 0
            const next = () => {
                const middleware = this.middlewares[i++]
                if(middleware){
                    return middleware(req,res,next)
                }

                for(const layer of this.stack){
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
    this.json = function() {

    }

    return new Express();
}

module.exports = express;