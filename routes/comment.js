const express = require("express");
const models = require("../models/index");


const router = express.Router();


router.post("/add",async (req, res)=>{
    if(!req.session.userId || !req.session.userLogin){
        res.json({
            ok: false
        });
    }else{
        const body = req.body.body;
        const post = req.body.post;
        const parent = req.body.parent;
        try {
            if(body){
                if(!parent){
                    await models.comment.create({
                        body,
                        post,
                        owner: req.session.userId
                    });
                    res.json({
                        ok: true
                    });
                }else{
                    const parentComment = await models.comment.findById(parent);
                    if(!parentComment){
                        res.json({
                            ok: false
                        });
                    }
                    const comment = await models.comment.create({
                        body,
                        post,
                        owner: req.session.userId,
                        parent,
                    });
                    const children = parentComment.children;
                    children.push(comment.id);
                    parentComment.children = children;
                    res.json({
                        ok: true
                    });
                    await parentComment.save();
                }
            }else{
                res.json({
                    ok: false,
                    error: "Текст не ведено!"
                });
            }
        } catch (error) {
            res.json({
                ok: false
            });
        }
    }

});


module.exports = router;