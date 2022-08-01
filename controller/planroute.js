
var express = require('express');
const planroute  = express.Router(); 
const planmgt = require('../controller/planmgt')

planroute.post('/createplan', planmgt.createplan)
planroute.post('/checkplan', planmgt.checkplan)
planroute.post('/updateplan', planmgt.updateplan)
planroute.post('/listplans', planmgt.listplans)
planroute.post('/retrieveplan', planmgt.retrieveplan)

module.exports = planroute;