const express = require('express');
const bodyParser = require('body-parser');
const users = require('./routes/users/users');
const tasks = require('./routes/users/tasks/tasks');
const db = require('./db/db');
const routeGuard = require('./routes/rout-guard');
const jwt = require('jsonwebtoken');
const config = require('./config/config');

const app = express();

app.use(bodyParser.urlencoded({extended: false }));
app.use(bodyParser.json());
 
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


    app.use('/users', users); // USERES ROUTE WILL GO TO USER.JS
    app.use('/tasks', routeGuard, tasks);// TASKS ROUTE WILL GO TO TASKS.JS
    app.post('/refresh', (req, res, next) => {// GET A REFRESH TOKEN
        if(jwt.decode(req.headers.authorization.split(' ')[1], config.secret) != null){//check if the token is readable
        db.getUser(jwt.decode(req.headers.authorization.split(' ')[1], config.secret).user_email)//get the user from the database using email
        .then(json => {
            const token =  jwt.sign({// if user was found, create a new token
                user_email: JSON.parse(json).user_email,
                user_id: JSON.parse(json).user_id
            },config.secret,{
                expiresIn: config.tokenExpires
            });
            res.status(200).json({
                message: "Refreshed successfuly",
                token: token
                                });
        })
        .catch(err=>{
            res.status(404).json({
                message: "Something went wrong, please log in again",
                url: 'localhost:3000/signin',
                requirements: {
                    method: "POST",
                    body:{
                        user_email: "<USER_EMAIL>",
                        password: "<USER_PASSWORD>"
                    }
                },
                err: err
            });
        });    
    }else{
        res.status(500).json({
            message: "Please provide a valid Token"
        });
    }
    });



/////////////////////////////////////////////////////////////////
app.listen('3000', ()=>{
 
    console.log('Server is running on PORT 3000');
})

 