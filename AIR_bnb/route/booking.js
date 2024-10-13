const db = require('../db');
const express = require('express');
const util = require('../Util');
const config = require('../config');
const router = express.Router()

router.get('/',(req,res) => {
    const statement = `select * from bookings`;
    db.pool.query(statement,(error,bookings) => {
        res.send(util.createResult(error,bookings))
    })
})

router.post('/',(req,res)=>{
    const {propertyId,total ,fromDate,toDate} = req.body
    const statement = `insert into bookings(userId,propertyId, total,fromDate,toDate) values(?,?,?,?,?);`

    db.pool.execute(statement,[req.userId,propertyId,total,fromDate,toDate],(error,bookings)=>{
        res.send(util.createResult(error,bookings))
    })
})

module.exports = router