const express = require("express");
const router = express.Router();
const config = require("../config");
const models = require("../models/index");

async function posts(req, res){
    const userId = req.session.userId;
    const userLogin = req.session.userLogin;

    const pageLim = config.COUNT_PAGE;
    const page = req.params.page || 1;

    const posts = await models.post.find({}).skip(pageLim * page - pageLim).limit(pageLim).catch(()=>{
        throw new Error("Server error");
    });
    const count = await models.post.count().catch(()=>{
        throw new Error("Server error");
    });
    
    res.render("index.ejs", {
        user:{
            posts,
            current: page,
            pages: Math.ceil(count / pageLim),
            id: userId,
            login: userLogin
        }
    });
}

router.get("/", (req, res) => {
    posts(req, res);
});

router.get("/archive/:page", (req, res)=>{
    posts(req, res);
});


router.get("/onePost/:post", async (req, res, next) => {
    const url = req.params.post;
    const userId = req.session.userId;
    const userLogin = req.session.userLogin;

    if(!url){
        const err = new Error("Not Found");
        err.status = 404;
        next(err);
    }else{
       const post = await models.post.findOne({url});
        if(!post){
            const err = new Error("Not Found");
            err.status = 404;
            next(err);
        }else{
            res.render("post/onePost.ejs", {
                post,
                user:{
                    id: userId,
                    login: userLogin
                }
            });
        }
    }
});

module.exports = router;