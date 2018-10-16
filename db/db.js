const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ToDo'
});

db.connect((err)=>{

    if(err) throw err;
    console.log('DB is now Connected...');
});
 module.exports = {
    getUser: function(email){
        let sql = `SELECT * FROM users WHERE user_email = '${email}'`;
        return new Promise((resolve, reject)=>{
            db.query(sql, (err, result) =>{ 
                if(err) reject(err);
                else{       
                    const res =  {
                        user_name: result[0]['user_name'],
                        user_email: result[0]['user_email'],
                        user_password: result[0]['user_password'],
                        user_id: result[0]['user_id']
                    };
                    resolve(JSON.stringify(res));
                }
            });
        });
    },
    checkUser: function(email){
        let sql = `SELECT * FROM users WHERE user_email = '${email}'`;
        return new Promise((resolve, reject)=>{
            db.query(sql, (err, result) =>{ 
                if(err) reject(err);
                else{       
                    resolve(result.length > 0);
                }
            });
        });
    },
    getUsers: function(id){
        let sql = `SELECT * FROM users`;
        return new Promise((resolve, reject)=>{
            db.query(sql, (err, result) =>{
                if(err) reject(err);
                else{       
                    let res = [];
                    result.forEach(element => {
                        res.push(element);
                    });
                    resolve(JSON.stringify(res));
                }
            });
        });
    },
    getTasks: function(id){
        let sql = `SELECT * FROM tasks WHERE user_id = ${id}`;
        return new Promise((resolve, reject)=>{
            db.query(sql, (err, result) =>{
                if(err) reject(err);
                else{       
                    let res = [];
                    result.forEach(element => {
                        res.push(element);
                    });
                    resolve(JSON.stringify(res));
                }
            });
        });
    },
    addUser: function(user){
        
        let sql = `INSERT INTO users (user_name, user_email, user_password) VALUES ("${user.user_name}", "${user.user_email}", "${user.user_password}")`;
        return new Promise((resolve, reject)=>{
            db.query(sql, (err, result) =>{
                if(err) reject(err);
                else{       
                    resolve();
                }
            });
        });
    },
    addTask: function(task){
        let sql = `INSERT INTO tasks (user_id, group_id, submit_date, due_date, starred, task) VALUES
         (${task.user_id}, ${task.group_id},NOW(), ${task.due_date}, ${task.starred}, "${task.task}" )`;
        return new Promise((resolve, reject)=>{
            db.query(sql, (err, result) =>{
                if(err) reject(err);
                else{       
                    resolve();
                }
            });
        });
    },
    getTaskOwner: function(task_id){
        let sql = `SELECT user_id FROM tasks WHERE task_id = ${task_id}`;
        return new Promise((resolve, reject)=>{
            db.query(sql, (err, result) =>{
                if(err) reject(err);
                else{       
                    
                    resolve(result);
                }
            });
        });
    },
    updateTask: function(task){
        let sql = `UPDATE tasks set group_id = ${task.group_id}, due_date = "${task.due_date}", starred = ${task.starred}, task = "${task.task}"
        WHERE task_id = ${task.task_id}
        `;
        return new Promise((resolve, reject)=>{
            db.query(sql, (err, result) =>{
                if(err) reject(err);
                else{       
                    resolve();
                }
            });
        });
    },
    deleteTask: function(task_id){
        let sql = `DELETE from tasks WHERE task_id = "${task_id}"`;
        return new Promise((resolve, reject)=>{
            db.query(sql, (err, result) =>{
                if(err) reject(err);
                else{       
                    resolve();
                }
            });
        });
    },
    delUser: function(id){
        let sql = `DELETE from users WHERE user_id = ${id}`;
        return new Promise((resolve, reject)=>{
            db.query(sql, (err, result) =>{
                if(err) reject(err);
                else{       
                    resolve();
                }
            });
        });
    }
};