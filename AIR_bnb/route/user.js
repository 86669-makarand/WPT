const express = require("express"); // web framework building for API
const db = require("../db");
const util = require('../Util');
const crypto = require('crypto-js');
const jwt = require('jsonwebtoken');
const router = express.Router();
const config = require('../config');


router.put('/profile/',(request,response)=>{
    const{firstName,lastName,phone} = request.body
    const statement = `update user set firstName =?, lastName =?, phoneNumber =? where id =?`
    db.pool.execute(
        statement,
        [firstName,lastName,phone,request.userId],
        (error,result) => {
            response.send(util.createResult(error,result))
        }
    )
})

router.get('/profile/',(request,response)=>{
    const statement = `select firstName, lastName, phoneNumber, email from user where id =?`
    db.pool.execute(statement,[request.userId],(error,result)=>{
        response.send(util.createResult(error,result))
    })
})

// http://127.0.0.1:9999/user/profile/5
router.get('/profile/:id',(request,response)=>{
    const {id} = request.params
    const statement = `select * from user where id=?;`
    db.pool.execute(statement,[id],(error,properties)=>{
        response.send(util.createResult(error,properties[0]))
    })
})

router.post('/login',(req,res)=>{
    const {email,password} = req.body;
    const stmp = `select id, firstName, lastName, phoneNumber, isDeleted from user where email =? and password =?`; 
    const encryptedPassword = String(crypto.SHA256(password))
    // jwt (JSON web token)function --> sign, payload, verify
    db.pool.query(stmp,[email,encryptedPassword],(err,users)=>{
        if(err)
        {
            res.send(util.createErrorResult(err));
        }
        else
        {
            if(users.length === 0)
            {
                res.send(util.createSuccessResult('User dose not exist !!!'))
            }
            else 
            {
                const user = users[0]
                console.log("user"+user);
                if(user.isDeleted)
                {
                    res.send(util.createErrorResult('Your account is Closed !!!'))
                }
                else
                {
                    // create the payload
                    const payload  = { id : user.id}
                    const token = jwt.sign(payload,config.secret)
                    const userData = {
                            token,
                            name : `${user['firstName']} ${user['lastName']}`,
                    }
                    res.send(util.createSuccessResult(userData))
                }
            }

        }

    }
)});
router.post('/register',(req, res)=>{
const { firstName, lastName, email,password, phone} = req.body
const statement = `insert into user (firstName, lastName, email, password, phoneNumber) values (?, ?, ?, ?, ?);`
const encryptedPassword = String(crypto.SHA256(password))
db.pool.execute(
    statement,
    [firstName,lastName,email,encryptedPassword,phone],
    (error,result)=>{
        res.send(util.createResult(error,result))
    }
);
});


module.exports=router;