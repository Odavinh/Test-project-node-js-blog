const express = require("express");
const models = require("../models/index");
const Turndown = require("turndown");

const router = express.Router();


router.get("/add",(req, res)=>{
    const id = req.session.userId;
    const login = req.session.userLogin;

    if(!id || !login){
        res.redirect("/");
    }else{
        res.render("post/add.ejs", {
            user:{
               id,
               login 
            }
        });
    }
});

router.post("/add",async (req, res)=>{
    const title = req.body.title;
    const body = req.body.body;
    const turnDown = new  Turndown();

    if(!req.session.userId || !req.session.userLogin){
        res.redirect("/");
    }else{
        if(!title || !body){
            res.json({
                ok: false,
                error: "Всі поля повинні бути заповнені!",
                fields: ["title", "body"]
            });
        } else if (title.lenght < 6 || title.lenght > 50) {
            res.json({
            ok: false,
            error: "Довжина заголовка від 6 до 50 символів!",
            fields: ["title"]
            });
        }else if(body.lenght < 20 || body.lenght > 10000){
            res.json({
            ok: false,
            error: "Довжина стітті від 20 до 10000 символів!",
            fields: ["body"]
            });
        }else{
            const post =  await models.post.create({
                title,
                body: turnDown.turndown(body),
                owner: req.session.userId
            });
    
            if(post){
                console.log(post);
                res.json({
                    ok: true
                });
            }else{
                console.error(post.errors);
                res.json({
                    ok: false
                });
            }
        }
    }
});


module.exports= router;

