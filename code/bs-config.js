var fallback = require('connect-history-api-fallback');
var log = require('connect-logger');
var sqlite3 = require('sqlite3').verbose();
var url = require('url');
var qs = require('querystring');

function sql(){
  // open the database
  let db = new sqlite3.Database('./src/Authenticate.db');
 
  let sql = `SELECT * FROM testrun`;
 
  db.all(sql, [], (err, rows) => {
    if (err) {
      //log error
      console.log("ERROR running SQL query");
    }
    rows.forEach((row) => {
      console.log(row.name);
    });
  });
 
  // close the database connection
  db.close();
}

function getToken(){
  //
}

module.exports = {
  server: {
    baseDir: [
      "./src",
      "./build/contracts"
    ],
    middleware: [
      log({ format: '%date %status %method %url' }),
      fallback({
        index: '/index.html',
        htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'] // systemjs workaround
      }),
      function (req, res, next) {
        var parsed = url.parse(req.url);
        if (parsed.pathname.match(/get_token/)){
          console.log(req.url);
          console.log(req.method);
          sql();
          if(req.method == "POST"){
            var postData = '';
            req.on('data', function(chunk) {
              var string = chunk.toString('utf8');
              postData += string;
            });
            req.on('end', function() {
              console.log(postData);  
              var post = qs.parse(postData);
              console.log(post);
              res.write(postData);
              res.end('/n hello world');
            });
          }
        }
        next();
      }
    ],
    routes: {
      "/vendor": "./node_modules"
    }
  }
}
