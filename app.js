const express = require('express');
const bodyParser = require('body-parser');
const users = require('./routes/users/users');
const tasks = require('./routes/users/tasks/tasks');
const routeGuard = require('./routes/rout-guard');
const app = express();

app.use(bodyParser.urlencoded({extended: false }));
app.use(bodyParser.json());
 
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


    app.use('/users', users);
    app.use('/tasks', routeGuard, tasks);



/////////////////////////////////////////////////////////////////
app.listen('3000', ()=>{
 
    console.log('Server is running on PORT 3000');
})

 