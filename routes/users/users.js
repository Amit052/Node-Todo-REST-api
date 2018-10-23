const express = require('express');
const db = require('../../db/db');
const groups = require('./groups/groups');
const config = require('../../config/config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const routeGuard = require('../rout-guard');
const router = express.Router();


let tokenList = [];
router.use('/groups', routeGuard, groups);

router.patch('', routeGuard, (req, res)=>{
    if(jwt.verify(req.headers.authorization.split(' ')[1], config.secret).user_id == req.body.user_id){
        const updatedUser = {
            user_name: req.body.user_name,
            user_email: req.body.user_email,
            user_id: req.body.user_id
        };
        db.updateUser(updatedUser)
        .then(json=>{
            res.status(200).json({
                messgae: "Profile was successfuly updated"
            });
        })
        .catch(err=>{
            res.status(500).json({
                messae: "Something went wrong"
            });
        });
    }else{
    res.status(409).json({
        messgae: "Permission denied!"
    });
    }
    
    });


    router.patch('/updatepassword', (req, res, next) => {
        db.getUser(req.body.user_email)
        .then( json =>{
            bcrypt.compare(req.body.old_password, JSON.parse(json).user_password, (err, result)=>{
                if(err){
                 res.status(404).json({message: "Auth failed", error: err});
                }
                if(result){
                    bcrypt.hash(req.body.new_password, 12, (err, hash)=>{
                        if(err){
                            res.status(500).json({
                                message: 'Something went wrong...'
                            });
                        }else{
                            db.updateUserPassword({
                                user_email: req.body.user_email,
                                user_password: hash  
                            })
                            .then(data=>{
                                console.log(data);
                                const token =  jwt.sign({
                                    user_email: JSON.parse(data).user_email,
                                    user_id: JSON.parse(data).user_id
                                },config.secret,{
                                    expiresIn: '1h'
                                });
                                res.status(201).json({
                                    message: "Password was updated successfuly...",
                                    token: token
                                });
                            })
                            .catch(err=>console.log(err));
                        }
                    });
                } else{
                    res.status(500).json({
                        message:"Something went wrong"
                    });
                }
           });
      }); 
    });
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
 if(req.body.user_email != undefined && req.body.user_password != undefined){
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
                },config.secret,{
                    expiresIn: config.tokenExpires
                });
                const refreshToken =  jwt.sign({
                    user_email: JSON.parse(json).user_email,
                    user_id: JSON.parse(json).user_id
                },config.refreshSecret,{
                    expiresIn: config.refreshTokenExpires
                });
                 
        res.status(200).json({
            message: "Auth successfuly",
            token: token,
            refreshToken: refreshToken
                            });
                     }else{
                         res.status(409).json({
                             message: "Authentication failed" 
                         });
                     }
        })
    });
}else{
    res.status(404).json({
        message: "Something went wrong, please log in again",
        url: 'localhost:3000/signin',
        requirements: {
            method: "POST",
            body:{
                user_email: "<USER_EMAIL>",
                password: "<USER_PASSWORD>"
            }
        }
    });
}
});


module.exports = router;
