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
    checkGroupAdmin: function(group_id){
        let sql = `SELECT admin_id FROM groups WHERE group_id = ${group_id}`;
        return new Promise((resolve, reject)=>{
            db.query(sql, (err, result) =>{ 
                if(err) reject(err);
                else{       

                    resolve(result);
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
    addGroupUser: function(user){
        
        let sql = `INSERT INTO user_groups (user_id, group_id) VALUES (${user.user_id}, ${user.group_id})`;
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
    userInGroup: function(group){
        let sql = `SELECT group_id FROM user_groups WHERE group_id = ${group.group_id} AND user_id = ${group.user_id}`;
        return new Promise((resolve, reject)=>{
            db.query(sql, (err, result) =>{
                if(err) reject(err);
                else{       
                    if(result.length > 0) resolve(true);
                    else
                    resolve(false);
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
    deleteGroup: function(group_id){
        let sql = `DELETE from groups WHERE group_id = ${group_id}`;
        return new Promise((resolve, reject)=>{
            db.query(sql, (err, result) =>{
                if(err) reject(err);
                else{       
                    resolve();
                }
            });
        });
    },
    deleteGroupusers: function(group_id){
        let sql = `DELETE from user_groups WHERE group_id = ${group_id}`;
        return new Promise((resolve, reject)=>{
            db.query(sql, (err, result) =>{
                if(err) reject(err);
                else{       
                    resolve();
                }
            });
        });
    },
    deleteGroupUser: function(data){
        let sql = `DELETE from user_groups WHERE group_id = ${data.group_id} AND user_id = ${data.user_id}`;
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
    },
    getGroups: function(user_id){
        let sql = `SELECT * FROM user_groups inner join groups ON groups.group_id = user_groups.group_id WHERE user_groups.user_id = ${user_id}`;
 
        return new Promise((resolve, reject)=>{
            db.query(sql, (err, result) =>{
                
                if(err){
        
                    reject(err);
                } 
                else{       
                    let json = [];
                    result.forEach(element => {
                        json.push(element);
                    });
              
                    resolve(json);
                }
            });
        });
    },
    addGroup: function(group){
        let sql = `INSERT INTO groups (group_name, admin_id) VALUES ('${group.group_name}', ${group.admin_id})`;
        console.log(sql);
        return new Promise((resolve, reject)=>{
            db.query(sql, (err, result) =>{
                if(err) reject(err);
                else{  
                    let sql2 = `INSERT INTO user_groups (user_id, group_id) VALUES (${group.admin_id}, ${result.insertId})`;     
                    db.query(sql2, (err2, result2)=>{
                        if(err2) reject(err2)
                        else resolve ();
                    });
                    resolve();
                }
            });
        });
    },
    updateGroup: function(group){
        let sql = `UPDATE groups set group_name = "${group.group_name}"
        WHERE group_id = ${group.group_id}
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

    updateUser: function(user){

        let sql = `UPDATE users set user_email = "${user.user_email}", user_name="${user.user_name}"
        WHERE user_id = ${user.user_id}`;
        return new Promise((resolve, reject)=>{
            db.query(sql, (err, result) =>{
                if(err) reject(err);
                else{       
                    resolve();
                }
            });
        });
    },
    updateUserPassword: function(user){

        let sql = `UPDATE users set user_password = "${user.user_password}"
        WHERE user_email = "${user.user_email}"`;
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