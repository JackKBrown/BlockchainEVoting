var fallback = require('connect-history-api-fallback');
var log = require('connect-logger');
var sqlite3 = require('sqlite3').verbose();
var url = require('url');
var qs = require('querystring');
var fs = require('fs');

/* This function prepends the public key from the database to the page given
 * 
 * parameter: res - result of http/s call to node server
 */
function sql_public(res){
// open the database
  let db = new sqlite3.Database('./src/Authenticate.db');
 
  let sql = "SELECT * FROM authority";
 
  db.get(sql, [], (err, row) => {
    if (err) {
      //log error
      console.error(err.message);
    }
    if (row == undefined) {
      //return blank page serious error with server
      res.end("not found, server err");
    }else{
      //fetch the html to prepend to and serve to client
      fs.readFile('./src/get_token.html', function (err, html) {
        if (err) {
          console.error(err.message); 
        }
        //create public key information
        html = html.toString();
        var x = html.indexOf('<div id="insertion" style="display: none">');
        var insert = '<p class="text-center">Public Key:</p>';
        insert = insert + '<input id="public_key" type="text" class="form-control" value="'+row.pub_key+'" style="display: none" readonly>';
        insert = insert + '<p class="text-center" style="display: none">Modulus:</p>';
        insert = insert + '<input id="big_N" type="text" class="form-control" value="'+row.big_N+'" style="display: none" readonly>';
        var new_html = splice(html, insert, x+42);
        //return html
        res.end(new_html);
      });
    }
  });
 
  // close the database connection
  db.close();
}

/* This function returns the signed blinded message to the client
 * 
 * parameter: post - post request information
 * parameter: res - result of http/s call to node server
 */
function sql_auth(post, res){
  // open the database
  let db = new sqlite3.Database('./src/Authenticate.db');
  
  let sql = "SELECT * FROM client WHERE name = ? AND password = ?";
 
  db.get(sql, [post.name, post.password], (err, row) => {
    if (err) {
      //log error
      console.error(err.message);
    }
    if (row == undefined) {
      res.end("not found");
    }else if(row.got_token == 1){
      res.end("already voted");
    }else{
      //update database to show that client has voted
      let insert_sql = "UPDATE client SET got_token=1 WHERE name='"+row.name+"'";
      db.run(insert_sql, [], function(err) {
        if (err) {
          return console.error(err.message);
        }
        console.log(`Row(s) updated: ${this.changes}`);
      });
      //fetch the html to serve to the client
      fs.readFile('./src/auth_result.html', function (err, html) {
        if (err) {
          console.error(err.message); 
        }
        let sql2 = "SELECT * FROM authority";
        db.get(sql2, [], (err, row2) => {
          if (err) {
            //log error
            console.error(err.message);
          }
          if (row == undefined) {
            res.end("not found, server err");
          }else{
            
            //values to be added
            html = html.toString();
            var m_dash = BigInt(post.mDash);
            var big_N = BigInt(row2.big_N);
            var private = BigInt(row2.priv_key);
            //sign the message
            var signed_blinded_m = bigint_mod_pow(m_dash, private, big_N);
            
            var x = html.indexOf('<div id="insertion" style="display: none">');
            
            //html to be inserted
            var insert = '<p class="text-center">Public Key:</p>';
            insert = insert + '<input id="public_key" type="text" class="form-control" value="'+row2.pub_key+'" readonly>';
            insert = insert + '<p class="text-center">Modulus:</p>';
            insert = insert + '<input id="big_N" type="text" class="form-control" value="'+row2.big_N+'" readonly>';
            insert = insert + '<p class="text-center">signed and blinded message:</p>';
            insert = insert + '<input id="signed_blinded_m" type="text" class="form-control" value="'+signed_blinded_m+'" readonly>';
            var new_html = splice(html, insert, x+42);
            res.end(new_html);
          }
        });
      });
    }
  }); 
  // close the database connection
}

/* This function inserts a string into another string at the given index
 * 
 * parameter: string - string to be spliced
 * parameter: insert - string to be inserted
 * parameter: index - the index in string to be inserted at
 */
function splice(string, insert, index){
  var new_string = string.slice(0,index)+insert+string.slice(index,string.length);
  return new_string;
}

/* This function performs bigint modular exponentiation X^y mod N
 * uses fast exponentiation by squaring to increase operation speed
 * 
 * parameter: base - X value
 * parameter: exp - exponent y 
 * parameter: mod - modulus N
 */
function bigint_mod_pow(base, exp, mod){
  if (mod == 1n) return 0;
  base = base%mod;
  var result = BigInt(1);
  while(exp>0n){
    if(exp % 2n == 1n) {
      result = ((result*base)%mod);
      //equivalent of a right bitwise shift
      exp = (exp-1n)/2n;
    }else{
      //equivalent of a right bitwise shift
      exp = exp/2n;
    }
    //square the base for fast exponentiation
    base = (base**2n)%mod;
  }
  return result
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
        //check for the get token page
        var parsed = url.parse(req.url);
        if (parsed.pathname.match(/get_token/)){
          //if post data is present then it should be from a sign request
          if(req.method == "POST"){
            var postData = '';
            req.on('data', function(chunk) {
              var string = chunk.toString('utf8');
              postData += string;
            });
            req.on('end', function() {
              var post = qs.parse(postData);
              sql_auth(post, res);
            });
          //else the page needs the public key information
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
