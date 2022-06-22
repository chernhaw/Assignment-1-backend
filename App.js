var express= require('express');
var cors = require('cors');
const { get } = require('express/lib/response');

var app = express();
var mysql = require('mysql');

var port = process.env.PORT || 8080;
console.log (port);
app.use(cors());
app.use('/assets',express.static(__dirname+'/public'));
app.use(express.json());

var con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"password",
    database:"nodelogin"
});

app.post('/login', function(req, res){
   
   console.log("request" + req.body);
   const username = Object.values(req.body.username).toString().replaceAll(',','');
   const password = Object.values(req.body.password).toString().replaceAll(',','');
    console.log(username);
    console.log(password);
    const sql = "select username, password from "
    + "nodelogin.accounts where username ='"+username+"' and password ='"+password+"'";
    console.log(sql);
    con.query(sql ,
    function(err, rows){
        if(err) throw err;
        console.log(rows);
        res.send(rows);
    });

    /*

    con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Result: " + result);
  });
});
    */

});

app.post('/newuser', function(req, res){
    
   
    console.log("new user :"+req.body);
    const username = Object.values(req.body.username).toString().replaceAll(',','');
    const password = Object.values(req.body.password).toString().replaceAll(',','');
    const email = Object.values(req.body.email).toString().replaceAll(',','');
     console.log(username);
     console.log(password);
     console.log(email);

     // check if username and/or email exist
     const sqlName = "select username from "
     + "nodelogin.accounts where username ='"+username+"'";
 
     const sqlEmail = "select email from "
      + "nodelogin.accounts where email ='"+email+"'";
      var duplicate ="";
 
     con.connect(function(err) {
       //  if (err) throw err;
         console.log("Connected!");
         
         con.query(sqlName, function (err, result) {
           
          // if (err) throw err;
 
           try {
             console.log("checkExisting -Result for username : " + result[0].username);
             duplicate = duplicate + "name=true"
             console.log("checkExisting - duplicate for username "+ duplicate);
           } catch ( err){
             console.log("checkExisting - err in checking username");
             
            
           }
         });
 
         con.query(sqlEmail, function (err, result) {
             
          //   if (err) throw err;
             try {
                
                 console.log("checkExisting -Result for email : " + result[0].email);
                
                 duplicate = duplicate + " email=true";
                 console.log("checkExisting - duplicate for email "+ duplicate);
                 
               } catch ( err){
                 console.log(err);
                 console.log("checkExisting -err in checking email ");
                 
               }
               console.log("checkExisting - username and email : "+ duplicate);
             
               if (duplicate.length==0){
                // not duplicate insert data into nodelogin.accounts
                console.log("checkExisting - inserting username, email and password into nodelogin.accounts");
               
                sqlInsert = "insert into nodelogin.accounts ( username, password, email) values ('"+username+"','"+password+"','"+email+"');";
                console.log("checkExisting - "+sqlInsert);
                try {
                con.query(sqlInsert, function (err, result) {
                 // if (err) throw err;
                 });
                } catch (err){
                  console.log("checkExisting - Error in inserting  nodelogin.accounts")
                  console.log(err);
                }

               }


              
               if (duplicate.length!=0){
                res.send(duplicate);
               }
              
               
              
           });
           
       });
 });
 


app.get('/', function(req, res){

    con.query('select id, username, password email from nodelogin.accounts',
    function(err, rows){
        if(err) throw err;
        console.log(rows);
    });
   

    res.send('<html><head><link href=assets/style.css type=text/css rel=stylesheet/><h1>Hello Jesus</h1></head></html>')
});

app.get('/person/:id', function(req, res){
    console.log("Request Url "+req.url);
    res.send('<html><head><link href=assets/style.css type=text/css rel=stylesheet/></head><body><h1>Person: '+
    req.params.id + '</h1></body></html>');
});

app.use('person/:id', function(req, res, next){
    console.log("Request Url : "+req.url);
      

})
app.get('/api',function(req, res){
    res.json({firstname:'John', lastname:'Doe'});
});

app.listen(port);

function checkExisting(username, email){
    const sqlName = "select username from "
    + "nodelogin.accounts where username ='"+username+"'";

    const sqlEmail = "select email from "
     + "nodelogin.accounts where email ='"+email+"'";
     var duplicate ="";

    con.connect(function(err) {
      //  if (err) throw err;
        console.log("Connected!");
        
        con.query(sqlName, function (err, result) {
          
         // if (err) throw err;

          try {
            console.log("checkExisting -Result for username : " + result[0].username);
            duplicate = duplicate + "name=true"
            console.log("checkExisting - duplicate for username "+ duplicate);
          } catch ( err){
            console.log("checkExisting - err in checking username");
            
           
          }
        });

        con.query(sqlEmail, function (err, result) {
            
         //   if (err) throw err;
            try {
               
                console.log("checkExisting -Result for email : " + result[0].email);
               
                duplicate = duplicate + " email=true";
                console.log("checkExisting - duplicate for email "+ duplicate);
                
              } catch ( err){
                console.log(err);
                console.log("checkExisting -err in checking email ");
                
              }
              console.log("checkExisting - username and email : "+ duplicate);
             
              
             
          });
          
      });
      
     
}

function checkEmail(email){

    sqlEmail = "select email from "
     + "nodelogin.accounts where email ='"+email+"'";


     con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        con.query(sqlEmail, function (err, result) {
          if (err) throw err;
          console.log("Result for email : " + result[0].email);
          if( result[0].email!="" ){
            return "email";
          }
        });
      });
     
     
}