const express = require('express');
const router = express.Router();
const verify = require('./protectedRoutes');

const Post = require('../models/Post')



//GET ALL POSTS
router.get('/', verify, async (req, res) => {
    try{
        const posts = await Post.find();
        res.json(posts);
    }
    catch(err){
        res.json({message:err})
    }
});

//GET SPECIFIC POST
router.get('/:postId', verify, async (req, res) => {
    try{
        const post = await Post.findById(req.params.postId);
        res.json(post);
    }
    catch(err){
        res.json({message:err});
    }
});

//DELETE POST
router.delete('/:postId', verify, async (req, res) => {
    try{
        const removedPost = await Post.remove({_id: req.params.postId});
        res.json(removedPost)
    }
    catch(err){
        res.json({message:err});
    }
})

//UPDATE POST
router.patch('/:postId', verify, async (req, res) => {
    try{
        const updatedPost = await Post.updateOne(
            {_id: req.params.postId}, 
            { $set: {title: req.body.title}});
        res.json(updatedPost);
    }
    catch(err){
        res.json({message:err});
    }
})

//SUBMIT NEW POST
router.post('/create', verify, async (req, res) => {
    const post = new Post({
        title: req.body.title,
        description: req.body.description,
        userId: req.user._id
    });
    try{
        const savedPost = await post.save();
        res.json(savedPost);
    }catch(err){
        res.json({message: err});
    }
})


module.exports = router;