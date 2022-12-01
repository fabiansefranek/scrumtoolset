const mariadb = require('mariadb');
export const pool = mariadb.createPool({
    host: 'mydb.com',
    user:'myUser',
    password: 'myPassword',
    connectionLimit: 5
});
