const express = require('./express');
const router = express.Router();
const routerApi = express.Router();

const app = express();

router.get('/',(req,res)=>{
    
    res.json({message: 'Hello World!'})
})

router.get('/about',(req,res)=>{
    res.json({message: 'This is the about page'})
})


routerApi.get('/users',(req,res)=>{
    res.json({message: 'API users'})
})

app.use(router);
app.use('/api',routerApi);
app.use(express.json());
app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})
