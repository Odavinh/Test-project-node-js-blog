const express = require("express");
const models = require("../models/index");


const router = express.Router();


router.post("/add",async (req, res)=>{
    const title = req.body.title;
    const body = req.body.body;
    if(!req.session.userId || !req.session.userLogin){
        res.json({
            ok: false
        });
    }else{
        const comment = req.body.body;

        
    }

});


module.exports = router;