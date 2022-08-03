
var express = require('express');
const taskroute  = express.Router(); 
const taskmgt = require('../controller/taskmgt')

taskroute.post('/createtask', taskmgt.createtask)
taskroute.post('/counttask', taskmgt.counttask)
taskroute.post('/listapptasks', taskmgt.getAllTasksByApp)

module.exports = taskroute;