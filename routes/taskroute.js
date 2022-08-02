
var express = require('express');
const taskroute  = express.Router(); 
const taskmgt = require('../controller/taskmgt')

taskroute.post('/createtask', taskmgt.createtask)
taskroute.post('/counttask', taskmgt.counttask)
//taskroute.post('/listtask', taskmgt.listtask)

module.exports = taskroute;