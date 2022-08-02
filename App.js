 var express = require('express');
 var cors = require('cors');
 var app = express();

 var bodyParser = require('body-parser')
 const userroute = require('./routes/userroute')
 const approute = require('./routes/approute')
 const planroute = require('./routes/planroute');
const taskroute = require('./routes/taskroute');
// // TODO : split into route and put env into a file import env file
  var port = process.env.PORT || 8080;
 
  console.log (port);
  app.use(cors());
  app.use('/assets',express.static(__dirname+'/public'));
  app.use(bodyParser.json());
  // added as per https://stackoverflow.com/questions/37222313/request-body-is-null-for-post-request-in-nodejs
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use('/', userroute, approute, planroute, taskroute)

app.get('/api',function(req, res){
    res.json({firstname:'John', lastname:'Doe'});
});

app.listen(port);

