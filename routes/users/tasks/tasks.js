const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../../../db/db');
const router = express.Router();

 /*****************GET TASK************ */
router.get('/:id', (req, res, next) => {
    if( jwt.verify(req.headers.authorization.split(' ')[1], "secret").user_id == req.params.id){
    db.getTasks(req.params.id)
    .then(json=>{
        res.status(200).json(json);
    })
    .catch(err=>console.log(err));
}
else{
    res.status(409).json({message: "Permission denied"});
}
});


//***************ADD TASK****************** */
router.post('/', (req, res, next) => {
    const newTask = {
        user_id: jwt.verify(req.headers.authorization.split(' ')[1], "secret").user_id,
        group_id: req.body.group_id,
        due_date: req.body.due_date,
        starred: req.body.starred,
        task: req.body.task
    };
    db.addTask(newTask)
    .then(json=>{
        res.status(200).json(json);
    })
    .catch(err=>console.log(err));
    
});

//***************update TASK****************** */
router.patch('/', (req, res, next) => {
    db.getTaskOwner(req.body.task_id)
    .then(id=>{
        if( id[0].user_id == jwt.verify(req.headers.authorization.split(' ')[1], "secret").user_id){
            const updatedTask = {
                task_id: req.body.task_id,
                group_id: req.body.group_id,
                due_date: req.body.due_date,
                starred: req.body.starred,
                task: req.body.task
            };
            db.updateTask(updatedTask)
            .then(json=>{
                res.status(200).json({
                    message:"Task was updated successfuly..."
                });
            })
            .catch(err=>console.log(err));
        }else{
            res.status(409).json({message:"Permission denied!"});
        }
    })



});


//***************DELETE TASK****************** */
router.delete('/', (req, res, next) => {
    db.getTaskOwner(req.body.task_id)
    .then(id=>{
        if( id[0].user_id == jwt.verify(req.headers.authorization.split(' ')[1], "secret").user_id){
            db.deleteTask(req.body.task_id)
            .then(json=>{
                res.status(200).json({
                    message:"Task was deleted successfuly..."
                });
            })
            .catch(err=>console.log(err));
        }else{
            res.status(409).json({message:"Permission denied!"});
        }
    })



});
module.exports = router;