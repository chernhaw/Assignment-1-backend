
var express = require('express');
const taskroute  = express.Router(); 
const taskmgt = require('../controller/taskmgt')

taskroute.post('/createtask', taskmgt.createtask)
taskroute.post('/counttask', taskmgt.counttask)
taskroute.post('/listapptasks', taskmgt.getAllTasksByApp)
taskroute.post('/gettaskdetail', taskmgt.getTaskDetail)
taskroute.post('/getaccess', taskmgt.groupaccess)
taskroute.post('/updatetask', taskmgt.updateTask)
module.exports = taskroute;