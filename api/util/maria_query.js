const mariadb = require('mariadb');
const dotenv = require('dotenv');
dotenv.config ({path: './api/config/db.env'});


const pool = mariadb.createPool({
  host: process.env.db_host,
  user: process.env.db_user,
  password: process.env.db_password,
  database: process.env.db_database,
  connectionLimit: 5  
});

function maria_query(query, params) {
    return new Promise((resolve, reject) => {
        (async () => {
            const conn = await pool.getConnection();
            try {
                await conn.beginTransaction();
                const rows = await conn.query(query, params);
                await conn.commit();
                resolve(rows);
            } catch (error) {
                await conn.rollback();
                reject(error);
            } finally {
                conn.release();
            }
        })().catch(e => reject(e));
    });
}

module.exports = maria_query;