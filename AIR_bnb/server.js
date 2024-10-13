const express = require("express"); // serverside framework 
const userRouter = require('./route/user');
const propertyRouter = require('./route/property');
const categoryRouter = require('./route/category');
const util = require('./Util');
const config = require('./config');
const bookingRouter = require('./route/booking');
const crypto = require('crypto-js');
const jwt = require('jsonwebtoken');

const app  = express();
app.use(express.json());


// middleware to verify the token 
app.use((req,res,next)=>
{
    // Check if token is required for the API
    // == check type 
    // === check with value 
    if( req.url === '/user/login' || req.url === '/user/register' )
    {
        // skip verifing the token 
        next()
    }
    else
    {
        // get the token
        const token  = req.headers['token']
        console.log("token"+token);
    if(!token || token.length === 0)
    {
        res.send(util.createErrorResult('missing token'))
    }
    else
    {
        try
        {
            // verify the token 
            const payload = jwt.verify(token ,config.secret)

            // Add the user Id to the request
            req.userId = payload['id']

            next();

            // TODO : expiry logic
            
        }
        catch(ex)
        {
            response.send(util.createErrorResult('Invalid token !!! '))
        }
    }
    }
})
app.use('/user',userRouter);
app.use('/property',propertyRouter);
app.use('/category',categoryRouter);
app.use('/booking',bookingRouter);

app.listen(9999, ()=>{console.log("server started at port no 9999")})