
var express = require('express');
const approute  = express.Router(); 
const appmgt = require('../controller/appmgt')

approute.post('/createapp', appmgt.createapp)
approute.post('/checkapp', appmgt.checkapp)
approute.post('/listapp', appmgt.listapp)
approute.post('/updateapp', appmgt.updateapp)
approute.post('/appaccess', appmgt.checkaccess)

approute.post('/checkexistingapp', appmgt.checkexistingapp)
//checkexistingapp
//listlistenabledusers
//listdisabledusers
module.exports = approute;