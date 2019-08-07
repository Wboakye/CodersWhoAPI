const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const  { registerValidation, loginValidation } = require('../validation');


//CREATE NEW USER 
router.post('/register', async (req, res) => {

    //VALIDATE DATA 
    const { error } = registerValidation(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
    }else{

        //CHECK IF USER EXISTS
        const emailExists = await User.findOne({ email: req.body.email });
        const usernameExists = await User.findOne({ username: req.body.username }); 

        if(emailExists){
            res.status(400).send('Email already exists.');
        }else if(usernameExists){
            res.status(400).send('Username already exists.');
        }else{

            //IF NO ERROR, HASH PASSWORD
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            //CREATE NEW USER
            const user = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword
            });
            try{
                const savedUser = await user.save();
                res.send({ user: user._id });
            }catch(err){
                res.status(400).send(err);
            }
        };
    }
});

router.post('/login', async (req, res) => {

    //VALIDATE DATA 
    const { error } = loginValidation(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
    }else{

        //CHECK IF USER EXISTS
        const user = await User.findOne({ username: req.body.username });
        if(!user){
            res.status(400).send('Invalid username or password.');
        }else{
            //CHECK IF PASSWORD IS CORRECT
            const validPass = await bcrypt.compare(req.body.password, user.password);
            if(!validPass){
                res.status(400).send('Invalid username or password.')
            }else{

                //CREATE, ASSIGN, AND SEND TOKEN
                const token = jwt.sign({
                    _id: user._id,
                    fistName: user.firstName,
                    lastName: user.lastName
                }, process.env.TOKEN_SECRET);

                res.header('auth-token', token).send(token);
            }
        }
    }
});

module.exports = router;