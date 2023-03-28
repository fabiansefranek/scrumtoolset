import mysql from "mysql2/promise";

export async function connect(): Promise<mysql.Connection> {
    return await mysql.createConnection({
        host: "db",
        user: process.env.DB_USER,
        port: parseInt(process.env.DB_PORT!),
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });
}

export async function setup(con: mysql.Connection) {
    //Takes a connection and creates the database scheme there
    await con.query("CREATE DATABASE IF NOT EXISTS scrumtoolset;");
    await con.query("USE scrumtoolset;");
    await con.query(
        "CREATE TABLE IF NOT EXISTS Room( id varchar(255) primary key, displayName varchar(255) not null, state varchar(255) not null, createdAt int not null, votingSystem varchar(255), currentUserStory int, theme varchar(255) );"
    );
    await con.query(
        "CREATE TABLE IF NOT EXISTS User ( sessionId varchar(255) not null, username varchar(255) not null, createdAt int not null, roomId varchar(255), isModerator BOOLEAN, state varchar(255), vote varchar(255), PRIMARY KEY (sessionId), FOREIGN KEY (roomId) REFERENCES Room(id) );"
    );
    await con.query(
        "CREATE TABLE IF NOT EXISTS UserStory ( id int AUTO_INCREMENT PRIMARY KEY, name varchar(255) not null, content varchar(500), roomId varchar(255) not null, result varchar(255));"
    );
    await con.query(
        "CREATE TABLE IF NOT EXISTS Team ( name varchar(255) PRIMARY KEY not null, members varchar(255) not null);"
    );
}
