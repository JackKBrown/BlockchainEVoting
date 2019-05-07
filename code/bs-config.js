var fallback = require('connect-history-api-fallback');
var log = require('connect-logger');
var sqlite3 = require('sqlite3').verbose();
var url = require('url');
var qs = require('querystring');
var fs = require('fs');

function sql_public(res){
// open the database
  let db = new sqlite3.Database('./src/Authenticate.db');
 
  let sql = "SELECT * FROM authority";
  
  console.log(sql);
 
  db.get(sql, [], (err, row) => {
    if (err) {
      //log error
      console.error(err.message);
    }
    if (row == undefined) {
      res.end("not found");
    }else{
      fs.readFile('./src/get_token.html', function (err, html) {
        if (err) {
          console.error(err.message); 
        }
        html = html.toString();
        var x = html.indexOf('<div id="insertion">');
        var new_html = html.slice(0,x+20)+'<p class="text-center" id="public_key">Public Key'+row.pub_key+'</p><p class="text-center" id="big_N">Public Key'+row.big_N+'</p>'+html.slice(x+20,html.length);
        res.end(new_html);
      });
    }
  });
 
  // close the database connection
  db.close();
}

function sql_auth(username, password, res){
  // open the database
  let db = new sqlite3.Database('./src/Authenticate.db');
 
  let sql = "SELECT * FROM client WHERE name = '"+username+"' AND password = '"+password+"'";
  
  console.log(sql);
 
  db.get(sql, [], (err, row) => {
    if (err) {
      //log error
      console.error(err.message);
    }
    if (row == undefined) {
      res.end("not found");
    }else{
      fs.readFile('./src/auth_result.html', function (err, html) {
        if (err) {
          console.error(err.message); 
        }
        html = html.toString();
        var x = html.indexOf('<div id="insertion">');
        console.log(x);
        console.log(html);
        var new_html = html.slice(0,x+20)+'<p class="text-center">'+row.name+'</p>'+html.slice(x+20,html.length);
        console.log(new_html);
        res.end(new_html);
      });
    }
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
          if(req.method == "POST"){
            var postData = '';
            req.on('data', function(chunk) {
              var string = chunk.toString('utf8');
              postData += string;
            });
            req.on('end', function() {
              var post = qs.parse(postData);
              sql_auth(post.name, post.password, res);
            });
          } else {
            sql_public(res);
          }
        }else{
          next();
        }
      }
    ],
    routes: {
      "/vendor": "./node_modules"
    }
  }
}
