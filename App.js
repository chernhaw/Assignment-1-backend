 var express = require('express');
 var cors = require('cors');
 var app = express();

 const userroute = require('./routes/userroute')
// // TODO : split into route and put env into a file import env file
  var port = process.env.PORT || 8080;
 
  console.log (port);
  app.use(cors());
  app.use('/assets',express.static(__dirname+'/public'));
  app.use(express.json());

  app.use('/', userroute)

app.get('/api',function(req, res){
    res.json({firstname:'John', lastname:'Doe'});
});

app.listen(port);

