const express = require('express');
const db = require('../../../db/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../../../config/config');
const router = express.Router();


router.get('', (req, res)=>{
    user_id =  jwt.verify(req.headers.authorization.split(' ')[1], config.secret).user_id;

    db.getGroups(user_id)
    .then(json =>{
        res.status(200).json(json);
    })
    .catch(err=>{
        res.status(500).json({
            messgae: "Something went wrong",
            err: err
        })
    });
    
});


router.delete('', (req, res)=>{
 db.checkGroupAdmin(req.body.group_id)
 .then(id=>{
     if(id[0].admin_id == jwt.verify(req.headers.authorization.split(' ')[1], config.secret).user_id){
        db.deleteGroup(req.body.group_id)
        .then(()=>{
            db.deleteGroupusers(req.body.group_id)
            .then(()=>{
                res.status(200).json({
                    message: "Group was successfuly deleted!"
                });
            })
            .catch(err=>{
                res.status(500).json({
                    messgae: "Something went wrong",
                    err: err
                });
            });
        })
        .catch(err=>{
            res.status(500).json({
                messgae: "Something went wrong",
                err: err
            });
        });
     }
    else{
        res.status(409).json({
            messgae: "Permission denied!"
        });
    }
 })
 .catch();
});

router.post('', (req, res)=>{
    const newGroup = {
        admin_id: jwt.verify(req.headers.authorization.split(' ')[1], config.secret).user_id,
        group_name: req.body.group_name
    };
        db.addGroup(newGroup)
        .then(json =>{
            res.status(200).json({
                message: "The group was added successfuly"
            });
        })
        .catch(err=>{
            res.status(500).json({
                messgae: "Something went wrong",
                err: err
            })
        });
        
    });


    router.patch('', (req, res)=>{
        const updatedGroup = {
            admin_id: jwt.verify(req.headers.authorization.split(' ')[1], config.secret).user_id,
            group_name: req.body.group_name,
            group_id: req.body.group_id
        };
        db.checkGroupAdmin(21)
        .then(id=>{
            if(id[0].admin_id == jwt.verify(req.headers.authorization.split(' ')[1], config.secret).user_id){
                db.updateGroup(updatedGroup)
                .then(json =>{
                   
                    res.status(200).json({
                        message: "The group was updated successfuly"
                    });
                })
                .catch(err=>{
                    res.status(500).json({
                        messgae: "Something went wrong",
                        err: err
                    })
                });
            }else{
                res.status(409).json({
                    message: "Permission denied!"
                });
            }
            
        });

            
    });
        router.post('/newgroupuser', (req, res)=>{
            const newGroupUser = {
                admin_id: jwt.verify(req.headers.authorization.split(' ')[1], config.secret).user_id,
                group_id: req.body.group_id,
                user_id: req.body.user_id

            };
            db.userInGroup(newGroupUser)
            .then(ingroup=>{
                if(ingroup) res.status(200).json({
                    message: "User is already in the group"
                });
                else{
                    db.checkGroupAdmin(newGroupUser.group_id)
                    .then(result=>{
                        if(result[0].admin_id == newGroupUser.admin_id){
                            db.addGroupUser(newGroupUser)
                            .then(json=>{
                                res.status(200).json({
                                    message:"The user was added successfuly to the group!"
                                });
                            }).catch(err=>{
                                res.status(500).json({
                                    message: "Something went wrong",
                                    err:err
                                });
                            });
                        }else{
                            res.status(409).json({
                                message: "Permission denied!"
                            });
                        }
                    })
                }
            })
            .catch(err=>{
                res.status(500).json({
                    message:"Something went wrong",
                    err: err
                });
            });
        });
            
        router.delete('/deleteuser', (req, res)=>{
            const data = {
                user_id: req.body.user_id,
                group_id: req.body.group_id
            };

            db.checkGroupAdmin(data.group_id)
            .then(result=>{
                if(result[0].admin_id == jwt.verify(req.headers.authorization.split(' ')[1], config.secret).user_id){
                    db.deleteGroupUser(data)
                    .then(json=>{
                        res.status(200).json({
                            message: "User was successfuly removed from the group by Admin"
                        });
                    })
                    .catch(err=>{
                        res.status(500).json({
                            message:"Something went wrong",
                            err: err
                        });
                    });
                }
                else{
                    db.userInGroup(data)
                    .then(ingroup =>{
                        if(ingroup){
                            db.deleteGroupUser(data)
                            .then(json=>{
                                res.status(200).json({
                                    message: "User has left the group"
                                });
                            })
                            .catch(err=>{
                                res.status(500).json({
                                    message:"Something went wrong",
                                    err: err
                                });
                            });
                        }else{
                            res.status(409).json({
                                message: "Permission denied"
                             }); 
                        }
                    })
                    .catch(err=>{
                       res.status(500).json({
                           message: "Something went wrong",
                           err: err
                       }); 
                    })
                }
            })
        });



        
        
module.exports = router;