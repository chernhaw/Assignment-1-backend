
var express = require('express');
const taskroute  = express.Router(); 
const taskmgt = require('../controller/taskmgt')

taskroute.post('/createtask', taskmgt.createtask)
taskroute.post('/createtask_app', taskmgt.createtask_app)
taskroute.post('/apptaskid', taskmgt.apptaskid)
taskroute.post('/listapptasks', taskmgt.getAllTasksByApp)

taskroute.post('/listplantasks', taskmgt.getAllTasksByPlan)

taskroute.post('/gettaskdetail', taskmgt.getTaskDetail)
taskroute.post('/taskaccess', taskmgt.taskaccess)
taskroute.post('/updatetask', taskmgt.updateTask)

taskroute.post('/checktaskexist', taskmgt.checktaskexist)
taskroute.post('/promoteTask2Done', taskmgt.promoteTask2Done)
taskroute.post('/getTaskbyState', taskmgt.getTaskbyState)
module.exports = taskroute;