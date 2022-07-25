
var express = require('express');
const approute  = express.Router(); 
const appmgt = require('../controller/appmgt')

approute.post('/createapp', appmgt.createapp)




//listlistenabledusers
//listdisabledusers
module.exports = approute;