require('dotenv').config();
const pgp  =require('pg-promise');
//const conn=pgp('postgres://'+process.env.USERDB+':'+process.env.PASSDB+'@'+process.env.HOSTDB+':'+process.env.PORTDB+'/'+process.env.DBNAME);
const conn = new  pgp.Pool({
    host: process.env.HOSTDB,
    user: process.env.USERDB,
    password: process.env.PASSDB,
    database: process.env.DBNAME
    });

module.exports =conn;