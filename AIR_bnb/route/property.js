const express = require('express')
const db = require('../db')
const Util = require('../Util')
// const { route } = require('./user')
const router = express.Router()

router.post('/', (req, res) => {
    const {
        categoryId,
        title,
        details,
        address,
        contactNo,
        ownerName,
        isLakeView,
        isTV,
        isAC,
        isWifi,
        isMiniBar,
        isBreakfast,
        isParking,
        guests,
        bedrooms,
        beds,
        bathrooms,
        rent


    } = req.body

    const query = `insert into property (categoryId, title, details,address,contactNo,ownerName,isLakeView,isTv,isAC,isWifi,isMiniBar,isBreakfast,isParking,guests,Bedrooms,beds,bathrooms,rent) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
db.pool.execute(
    query,
    [
        // 1,
        categoryId,
        title,
        details,
        address,
        contactNo,
        ownerName,
        isLakeView,
        isTV,
        isAC,
        isWifi,
        isMiniBar,
        isBreakfast,
        isParking,
        guests,
        bedrooms,
        beds,
        bathrooms,
        rent,
    ],
    (error,result)=>{
        res.send(Util.createResult(error,result))
    }
)
})
module.exports=router;