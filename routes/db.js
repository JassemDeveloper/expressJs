require('dotenv').config();
const url=require('url');
const Pg=require('pg');

//const params = url.parse('postgres://'+process.env.USERDB+':'+process.env.PASSDB+'@'+process.env.HOSTDB+':'+process.env.PORTDB+'/'+process.env.DBNAME);
//const auth = params.auth.split(':');
const connection = 'postgres://'+process.env.USERDB+':'+process.env.PASSDB+'@'+process.env.HOSTDB+':'+process.env.PORTDB+'/'+process.env.DBNAME;

/*
//const conn=pgp('postgres://'+process.env.USERDB+':'+process.env.PASSDB+'@'+process.env.HOSTDB+':'+process.env.PORTDB+'/'+process.env.DBNAME);
const conn = new  pgp.Pool({
    user: "//"+ process.env.USERDB,
    password: process.env.PASSDB+'@'+process.env.HOSTDB,
    host:  process.env.HOSTDB,
    port: process.env.PORTDB,
    database: params.pathname.split('/')[1]
    host: process.env.HOSTDB,
    user: process.env.USERDB,
    password: process.env.PASSDB+'@'+process.env.HOSTDB,
    database: process.env.DBNAME
    });

const config = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1]
    };
*/
var conn = new Pg({
        connectionString: connection
      });

    conn.on('connect', () => {
        console.log('connected to the db');
    });
    
//const conn = new pg.Pool(config);
module.exports =conn;