import mysql from "mysql";



export function connect(){return mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'example',
    database: 'scrumtoolset'
})}

export function setup(con : mysql.Connection) {
    console.error("XXXXXXXXXXXXXXXXXXXXXXXXXXXX");
    con.connect();
    con.query(`CREATE DATABASE scrumtoolset;
        USE scrumtoolset;
        CREATE TABLE User (
        sessionId varchar(255) not null,
        username varchar(255) not null,
        createdAt int not null,
        roomId int,
        PRIMARY KEY (sessionId),
        FOREIGN KEY (roomId) REFERENCES Room(id)
        );
        CREATE TABLE Room(
        id varchar(255) primary key,
        displayName varchar(255) not null,
        state varchar(255) not null,
        createdAt int not null
        );
        CREATE TABLE Estimation(
        );`, (err, rows) => {
        if(err) throw err;
    });
}

