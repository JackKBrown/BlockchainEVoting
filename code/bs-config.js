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
        var new_html = html.slice(0,x+20)+'<p class="text-center">Public Key:</p><input id="public_key" type="text" class="form-control" value="'+row.pub_key+'" readonly><p class="text-center">Modulus:</p><input id="big_N" type="text" class="form-control" value="'+row.big_N+'" readonly>'+html.slice(x+20,html.length);
        res.end(new_html);
      });
    }
  });
 
  // close the database connection
  db.close();
}

function sql_auth(post, res){
  // open the database
  let db = new sqlite3.Database('./src/Authenticate.db');
 
  let sql = "SELECT * FROM client WHERE name = '"+post.name+"' AND password = '"+post.password+"'";
  
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
        let sql2 = "SELECT * FROM authority";
        db.get(sql2, [], (err, row2) => {
          if (err) {
            //log error
            console.error(err.message);
          }
          if (row == undefined) {
            res.end("not found");
          }else{
            html = html.toString();
            var m_dash = BigInt(post.mDash);
            var big_N = BigInt(row2.big_N);
            var private = BigInt(row2.priv_key);
            var signed_blinded_m = bigint_mod_pow(m_dash, private, big_N);
            console.log(signed_blinded_m);
            var x = html.indexOf('<div id="insertion">');
            
            //tidy up a bit
            var insert = '<p class="text-center">Public Key:</p>';
            insert = insert + '<input id="public_key" type="text" class="form-control" value="'+row2.pub_key+'" readonly>';
            insert = insert + '<p class="text-center">Modulus:</p>';
            insert = insert + '<input id="big_N" type="text" class="form-control" value="'+row2.big_N+'" readonly>';
            insert = insert + '<p class="text-center">signed and blinded message:</p>';
            insert = insert + '<input id="signed_blinded_m" type="text" class="form-control" value="'+signed_blinded_m+'" readonly>';
            var new_html = splice(html, insert, x);
            console.log(row);
            res.end(new_html);
          }
        });
      });
    }
  }); 
  // close the database connection
}

function splice(string, insert, index){
  var new_string = string.slice(0,index)+insert+string.slice(index,string.length);
  return new_string;
}

function bigint_mod_pow(base, exp, mod){
  if (mod == 1n) return 0;
  base = base%mod;
  var result = BigInt(1);
  while(exp>0n){
    if(exp % 2n == 1n) {
      result = ((result*base)%mod);
      exp = (exp-1n)/2n;
    }else{
      exp = exp/2n;
    }
    base = (base**2n)%mod;
  }
  return result
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
              console.log(post);
              sql_auth(post, res);
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
