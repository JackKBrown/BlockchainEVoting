Authenticate = {
  load: async () => {
    const sqlite3 = require('sqlite3').verbose();
    // open the database
    Authenticate.db = new sqlite3.Database('./Authenticate.db', sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Connected to the Authenticate database.');
    })
  },
  
  getToken: async () => {
    db.serialize(() => {
      db.each(`SELECT * FROM testrun`, (err, row) => {
        if (err) {
          console.error(err.message);
        }
        console.log(row.name + "\t" + row.pass);
      });
    })
    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Close the database connection.');
    });
  }
}

$(() => {
  $(window).load(() => {
    Authenticate.load()
  })
})
