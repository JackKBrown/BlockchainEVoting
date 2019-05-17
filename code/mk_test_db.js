const sqlite3 = require('sqlite3').verbose();

// open the database
let db = new sqlite3.Database('./src/Authenticate.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to database.');
  }
}); 
 
let sql = `SELECT *
           FROM client
           WHERE name  = ?
           AND password = ?`;
let name = 'katie';
let password = "pass"
// first row only
db.get(sql, [name,password], (err, row) => {
  if (err) {
    return console.error(err.message);
  }
  return row
    ? console.log(row.name)
    : console.log(`No playlist found with the id ${password}`);
 
});
 
// close the database connection
db.close();
