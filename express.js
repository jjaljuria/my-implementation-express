const http = require('node:http');

class Express{
    stack = []
    server = null

    constructor(){
        this.server = http.createServer()
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
            for(const layer of this.stack){
                if(layer.url === req.url && layer.method === req.method){
                    return layer.callback(req,res)
                }
            }
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