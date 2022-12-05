import mysql from "mysql";



export function connect(){return mysql.createConnection({
    host: 'db',
    user: 'root',
    password: 'example',
    database: 'scrumtoolset'
})}

export function setup(con : mysql.Connection) {
    con.connect();
    con.query("CREATE TABLE users (id INT);" , (err, rows) => {
        if(err) throw err;
    });
}

