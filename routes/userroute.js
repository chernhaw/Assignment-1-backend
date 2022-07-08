
var express = require('express');
const userroute  = express.Router(); 
const usermgt = require('../controller/usermgt')

userroute.post('/login', usermgt.login)
userroute.post('/email', usermgt.email)
userroute.post('/admin', usermgt.admin)
userroute.post('/updateemail',usermgt.updateemail )
userroute.post('/updatepass',usermgt.updatepass )
userroute.post('/activate', usermgt.activate)
userroute.post('/newuser', usermgt.newuser)
userroute.post('/checkgroup', usermgt.checkgroup)
userroute.post('/byemail', usermgt.byemail)
userroute.post('/byusername', usermgt.byusername)
userroute.post('/updateadm', usermgt.updateadm)
userroute.post('/checkusergroup', usermgt.checkusergroup)
userroute.post('/creategroup', usermgt.creategroup)
userroute.post('/groupassign', usermgt.groupassign)
userroute.post('/userexist', usermgt.userexist)
userroute.post('/groupremove', usermgt.groupremove)

userroute.post('/grouprole', usermgt.checkusergroup)
userroute.post('/groupadminassign', usermgt.groupadminassign)
userroute.post('/groupadminremove', usermgt.groupadminremove)
module.exports = userroute;