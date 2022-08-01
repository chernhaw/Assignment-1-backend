
var express = require('express');
const approute  = express.Router(); 
const appmgt = require('../controller/appmgt')

approute.post('/createapp', appmgt.createapp)
approute.post('/checkapp', appmgt.checkapp)
approute.post('/listapp', appmgt.listapp)
approute.post('/updateapp', appmgt.updateapp)

//listlistenabledusers
//listdisabledusers
module.exports = approute;