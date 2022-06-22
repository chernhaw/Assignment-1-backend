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
   
   console.log(req.body);
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