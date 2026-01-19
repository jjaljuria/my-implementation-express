const express = require('./express');

const app = express();

app.use(express.json());

app.get('/',(req,res)=>{
    res.end('Hello World from GET');
})

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})
