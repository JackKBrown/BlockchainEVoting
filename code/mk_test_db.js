const test_data = "INSERT INTO client VALUES ('john', 'pass', 0), ('eve', 'pass', 0)";

//    CONSTRAINT CA_public_key FOREIGN KEY (public_key)
//    REFERENCES CA(public_key)

const sqlite3 = require('sqlite3').verbose();

// open the database
let db = new sqlite3.Database('./src/Authenticate.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to database.');
  }
}); 

let sql = "SELECT * FROM authority";

db.get(sql, [], (err, row) => {
  if (err) {
    //log error
    console.error(err.message);
  }
  console.log(row);
});
 
// close the database connection
db.close();

