
var express = require('express');
const taskroute  = express.Router(); 
const taskmgt = require('../controller/taskmgt')

taskroute.post('/createtask', taskmgt.createtask)
taskroute.post('/counttask', taskmgt.counttask)
taskroute.post('/listapptasks', taskmgt.getAllTasksByApp)

taskroute.post('/listplantasks', taskmgt.getAllTasksByPlan)
taskroute.post('/gettaskdetail', taskmgt.getTaskDetail)
taskroute.post('/taskaccess', taskmgt.taskaccess)
taskroute.post('/updatetask', taskmgt.updateTask)
module.exports = taskroute;