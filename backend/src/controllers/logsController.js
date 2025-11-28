const pool = require('../db/pool');

async function getAllLogs(req,res){
  const result = await pool.query('SELECT * FROM logs ORDER BY id DESC');
  res.json(result.rows);
}

module.exports = { getAllLogs };
