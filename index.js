const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());
require('dotenv').config();

const verifyJWT = (req,res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).send({message: 'unauthorized'})
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token,process.env.ACCESS_TOKEN,(err,decoded)=>{
        if(err){
            return res.status(403).send({message: 'forbidden'})
        }
        req.decoded = decoded;
        next();
    })
}
app.get('/',(req,res)=>{
    res.send('running server')
})
app.post('/login',(req,res)=>{
   
    const user = req.body;

    if(user.password==='123456'){
        //require
        const accessToken = jwt.sign({email: user.email}, process.env.ACCESS_TOKEN, {expiresIn: '5s'})
        res.send({success: true, accessToken: accessToken});
    }else{
        res.send({success: false});
    }
})
app.get('/orders', verifyJWT,(req,res)=>{
   
    res.send([{id: 1, item: 'watch' },{id: 2, item: 'headphone'}])
})
app.listen(port,()=>{console.log('listening port=>',port)})