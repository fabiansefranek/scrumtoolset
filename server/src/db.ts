import mysql from "mysql";

export function connect(){return mysql.createConnection({
    host: 'db',
    user: 'root',
    password: 'example',
    database: 'scrumtoolset'
})}

export function setup(con : mysql.Connection) { //Takes a connection and creates the database scheme there
    con.connect();
    con.query("CREATE TABLE IF NOT EXISTS Room( id varchar(255) primary key, displayName varchar(255) not null, state varchar(255) not null, createdAt int not null, votingSystem varchar(255) );", (err, rows) => {
        if(err) throw err;
    });
    con.query("CREATE TABLE IF NOT EXISTS User ( sessionId varchar(255) not null, username varchar(255) not null, createdAt int not null, roomId varchar(255), isModerator BOOLEAN, state varchar(255), vote varchar(255), PRIMARY KEY (sessionId), FOREIGN KEY (roomId) REFERENCES Room(id) );", (err, rows) => {
        if(err) throw err;
    });
    con.query("CREATE TABLE IF NOT EXISTS UserStory ( id int AUTO_INCREMENT PRIMARY KEY, name varchar(255) not null, content varchar(500), roomId varchar(255) not null);", (err, rows) => {
        if(err) throw err;
    });
}

