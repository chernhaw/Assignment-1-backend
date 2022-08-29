
var express = require('express');
const userroute  = express.Router(); 
const usermgt = require('../controller/usermgt')

userroute.post('/login', usermgt.login)
userroute.post('/email', usermgt.email)
userroute.post('/admin', usermgt.checkgroup)
userroute.post('/updateemail',usermgt.updateemail )
userroute.post('/updatepass',usermgt.updatepass )
userroute.post('/activate', usermgt.activate)
userroute.post('/deactivate', usermgt.deactivate)
userroute.post('/newuser', usermgt.newuser)


userroute.post('/checkgroup', usermgt.checkgroup)


userroute.post('/byemail', usermgt.byemail)
userroute.post('/byusername', usermgt.byusername)
userroute.post('/updateadm', usermgt.updateadm)

userroute.post('/creategroup', usermgt.creategroup)
userroute.post('/groupassign', usermgt.groupassign)
userroute.post('/userexist', usermgt.userexist)
userroute.post('/groupremove', usermgt.groupremove)

userroute.post('/listgroup', usermgt.listgroup)
userroute.post('/listApplead', usermgt.listAppLeadgroups)
userroute.post('/listLead', usermgt.listLeadgroups)
userroute.post('/listPM', usermgt.listPMgroups)

userroute.post('/updateApplead', usermgt.updateAppLead)
userroute.post('/updateLead', usermgt.updateLead)
userroute.post('/updatePM', usermgt.updatePM)

userroute.post('/removeApplead', usermgt.removeAppLead)
userroute.post('/removeLead', usermgt.removeLead)
userroute.post('/removePM', usermgt.removePM)

userroute.post('/listusers', usermgt.listusers)
userroute.get('/listadminusers', usermgt.listadminusers)
userroute.post('/checkgroup', usermgt.checkgroup)
userroute.post('/groupedit', usermgt.groupedit)
userroute.post('/adminassign', usermgt.adminassign)
userroute.post('/adminunassign', usermgt.adminunassign)
userroute.post('/listdisabledusers', usermgt.listdisabledusers)
userroute.post('/listlistenabledusers', usermgt.listlistenabledusers)

module.exports = userroute;