const express = require('express');
const db = require('../../db/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();


router.post('/', (req, res, next) => {//add new user

    db.checkUser(req.body.user_email)
    .then(result => {
        if(!result){
            bcrypt.hash(req.body.user_password, 12, (err, hash)=>{
                if(err){
                    res.status(500).json({
                        message: 'Something went wrong...'
                    });
                }else{
                    db.addUser({
                        user_name: req.body.user_name,
                        user_email: req.body.user_email,
                        user_password: hash  
                    })
                    .then(json=>{
                        res.status(201).json({
                            message: "user was added successfuly..."
                        });
                    })
                    .catch(err=>console.log(err));
                }
            });
        }else{
            res.status(500).json({
                message: 'Something went wrong...'
            });
        }
    });
});
router.delete('/', (req, res, next) => { //delete user
    db.delUser(req.body.user_id)
    .then(json=>{
        res.status(201).json({
            message: "user was deleted successfuly..."
        });
    })
    .catch(err=>console.log(err));
    
});
 

router.get('/', (req, res, next) => {// get all users
    db.getUsers()
    .then(json=>{
        res.status(200).json(json);
    })
    .catch(err=>console.log(err));
    
});
router.post('/signin', (req, res, next) => {
    db.getUser(req.body.user_email)
    .then( json =>{
        bcrypt.compare(req.body.user_password, JSON.parse(json).user_password, (err, result)=>{
            if(err){
             res.status(404).json({message: "Auth failed", error: err});
            }
            if(result){
               const token =  jwt.sign({
                    user_email: JSON.parse(json).user_email,
                    user_id: JSON.parse(json).user_id
                },"secret",{
                    expiresIn: '1h'
                });
        
        res.status(200).json({
            message: "Auth successfuly",
            token: token
                            });
                     }else{
                         res.status(409).json({
                             message: "Authentication failed" 
                         });
                     }
        })
    });
});
module.exports = router;
