//app.post('/activate', 
// var express = require('express');
// var app = express();
// var cors = require('cors');

// var port = process.env.PORT || 8080;
// console.log (port);
// app.use(cors());
// app.use('/assets',express.static(__dirname+'/public'));
// app.use(express.json());
 var mysql = require('mysql');


const env = require('dotenv')
 env.config({path:'./config.env'})



 var con = mysql.createConnection({
 // host:process.env.HOST,
 //user:process.env.USER,
  user:"root",
  password:"password",
 //password:process.env.PASSWORD,

  database:"nodelogin"
// database:process.env.DATABASE
 } );


 const listapp = (req, res)=>{
  console.log("request - query app " + req.body);
 
  const sql_list_app = "select app_acronym from nodelogin.application";

  console.log("check app "+ sql_list_app);
  con.query(sql_list_app,
  function(err, rows){

      if(err) throw err;
      console.log(rows[1].app_acronym)
      res.send(rows)
  })
}



 const checkapp = (req, res)=>{

  console.log("request - query app " + req.body);
  var app_acronym=null
  try{
  app_acronym = Object.values(req.body.app_acronym).toString().replaceAll(',','');
  }catch (err){
    console.log("There is an error "+err)
  }
  const sql_check_app = "select app_acronym, app_description, app_rnumber, app_startdate, app_enddate, app_permit_open, app_permit_todolist, app_permit_doing, app_permit_done from nodelogin.application where app_acronym='"+app_acronym+"'";

  console.log("check app "+ sql_check_app);
  con.query(sql_check_app,
  function(err, rows){

      if(err) throw err;
      console.log("app result "+rows[0].app_acronym);
      console.log("app description "+rows[0].app_description);
      console.log("app rnumber "+rows[0].app_rnumber);
      console.log("app startdate "+rows[0].app_startdate);
      console.log("app enddate "+rows[0].app_enddate);
      console.log("app permit_open "+ rows[0].app_permit_open);
      console.log("app permit_todolist "+ rows[0].app_permit_todolist);
      console.log("app permit_doing "+ rows[0].app_permit_doing);
      console.log("app permit_done "+ rows[0].app_permit_done);

     

     // app_startdate, app_enddate, app_permit_open, app_permit_todolist, app_permit_doing, app_permit_done from nodelogin.application where app_acronym='"+app_acronym+"'";
     res.send(rows)
  })
}


const updateapp = (req, res)=>{
  console.log("request - update app  " + req.body);
  const app_acronym = Object.values(req.body.app_acronym).toString().replaceAll(',','');
  var app_rnumber 
  var app_description
  var app_start_date
  var app_end_date
  try {
    app_rnumber = Object.values(req.body.app_rnumber).toString().replaceAll(',','');
  } catch (e){
    app_rumber= null
  }
 // app_rnumber = Object.values(req.body.app_rnumber).toString().replaceAll(',','');
 try {
  app_description = Object.values(req.body.app_rnumber).toString().replaceAll(',','');
} catch (e){
  app_description= null
} 
 
try {
  app_start_date = Object.values(req.body.app_start_date).toString().replaceAll(',','');
} catch (e){
  app_start_date= null
} 


try {
  app_end_date = Object.values(req.body.app_end_date).toString().replaceAll(',','');
} catch (e){
  app_end_date= null
} 

  console.log("app_acronym : " +app_acronym)
  console.log("app_rnumber : " +app_rnumber)
  console.log("app_description : " +app_description)
  console.log("app_start_date : " +app_start_date)
  console.log("app_end_date : " +app_end_date)


  const sql_app_update = "update nodelogin.application set app_rnumber='"+app_rnumber+"', app_description='"+app_description+"', app_startdate='"+app_start_date+"', app_enddate='"+app_end_date+"' where app_acronym='"+app_acronym+"'";

  try {
    con.query(sql_app_update, function (err, result) {
     if (err) throw err;
     res.send(result)
     });
    } catch (err){
      console.log("checkExisting app - Error in updating nodelogin.accounts")
      console.log(err);
    }
}

  const createapp = (req, res)=>{
  console.log("request - create new app " + req.body);
  const app_acronym = Object.values(req.body.app_acronym).toString().replaceAll(',','');
  const app_rnumber = Object.values(req.body.app_rnumber).toString().replaceAll(',','');
  const app_description = Object.values(req.body.app_description).toString().replaceAll(',','');
  var app_start_date 
  var app_end_date 
  const app_permit_open = Object.values(req.body.app_permit_open).toString().replaceAll(',','');
  const app_permit_todolist = Object.values(req.body.app_permit_todolist).toString().replaceAll(',','');
  
  const app_permit_doing = Object.values(req.body.app_permit_doing).toString().replaceAll(',','');
  const app_permit_done = Object.values(req.body.app_permit_done).toString().replaceAll(',','');
 // const app_permit_create = Object.values(req.body.app_permit_create).toString().replaceAll(',','');
  

 try {
  app_start_date = Object.values(req.body.app_start_date).toString().replaceAll(',','');
} catch (e){
  app_start_date= null
} 


try {
  app_end_date = Object.values(req.body.app_end_date).toString().replaceAll(',','');
} catch (e){
  app_end_date= null
} 

  console.log("app_acronym : " +app_acronym)
  console.log("app_rnumber : " +app_rnumber)
  console.log("app_description : " +app_description)
  console.log("app_start_date : " +app_start_date)
  console.log("app_end_date : " +app_end_date)
  console.log("app_permit_open : " +app_permit_open)
  console.log("app_permit_todolist : " +app_permit_todolist)
  console.log("app_permit_doing : " +app_permit_doing)
  console.log("app_permit_done : " +app_permit_done)


  const sql_app_acronym_count = "select count(*) as appcount from nodelogin.application where app_acronym='"+app_acronym+"'";
  
  var msg='';
  console.log(sql_app_acronym_count);
  con.query(sql_app_acronym_count ,
  function(err, rows){
      if(err) throw err;

     // var resultStr = rows."count(*)";
      console.log( "Duplicate found for "+app_acronym+" : " +rows[0].appcount);
      
      var duplicate = rows[0].appcount
      console.log("Duplicate app acronym found for "+app_acronym+" :"+duplicate);
     // var duplicate = parseInt(duplicate);

      if (duplicate!=0){
       console.log("Duplicate found will not app")
        
      } else {

       
        var sqlInsertApp = "insert into nodelogin.application "+
        "(app_acronym, app_description, app_rnumber, app_startdate, app_enddate, app_permit_open, app_permit_todolist, app_permit_doing, app_permit_done)"+
        " values ('"+app_acronym+"','"+app_description+"','"+app_rnumber+"','"+app_start_date+"','"+app_end_date+"', '"+app_permit_open+"', '"+app_permit_todolist+"','"+app_permit_doing+"','"+app_permit_done+"')"
       
        
        try {
        con.query(sqlInsertApp, function (err, result) {
         if (err) throw err;

         });
        } catch (err){
          console.log("checkExisting app - Error in inserting  nodelogin.accounts")
          console.log(err);
        }

      }
     
      res.send(rows[0]);
  })
}



const groupedit = (req, res) =>{
//  var groupname = Object.values(req.body.groupname).toString();
   
  var groupname2 = req.body.groupname.toString()

  console.log("groupname2 : " + groupname2)

  //.replaceAll(',','').split(" ")[1]
  // groupname2 = groupname2.replaceAll(' ','').replaceAll(',','')
// const sql2 = `insert into nodelogin.group_assign ( username, groupname, admin ) values ("${username}","${groupname2}",false);`;
  
  if (groupname2!=undefined){
  const sql2 = `select username from nodelogin.group_assign where groupname in  ('`+groupname2+`')`;
  var members=""
  console.log("SQL to get groupmembers "+ sql2)

  try {
    con.query(sql2, function (err, result) {
     if (err) throw err;
    
     console.log("size of result "+result.length)

     for (var i =0; i<result.length; i++)
     members = members+result[i].username+","
     console.log(members)
     res.send(result);
     });

     
     
    } catch (err){
      console.log("groupmembers extracting  - group details errors ")
      console.log(err);
      
    }

    console.log("members " +members);
  }
  //groupedit  return members
}  







// app.post('/byusername', function(req, res){
 const byusername = (req, res)=>{  
  console.log("request - extracting username, active, email " + req.body);
  const username = Object.values(req.body.username).toString().replaceAll(',','');
  
   const sql = "select username, email, active from "
   + "nodelogin.accounts where username ='"+username+"'";
   console.log(sql);
   con.query(sql ,
   function(err, rows){
       if(err) throw err;
       console.log(rows[0]);
       res.send(rows[0]);
   });

};


  
  function passwordEncrypt (myPlaintextPassword){
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
  
    const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);
    console.log("passwordEncrypt - "+hash);
    return hash;
  }
  
  
  const updateadm = (req, res) =>{
    console.log("updating user admin right :"+req.body);
    const username = Object.values(req.body.username).toString().replaceAll(',','');
    const admin = Object.values(req.body.admin).toString().replaceAll(',','');
 
    console.log("username : "+username+ ", admin :"+admin)
   
    
     console.log("updating admin right of username : "+username+" to "+admin)
       // check if username and/or email exist
   const sqlAdminUpdate = "update nodelogin.accounts set admin = '"+admin+"' where username ='"+username+"'";
   
   con.connect(function(err) {
     //  if (err) throw err;
       console.log("Update user admin Connected!");
       console.log("Update user admin "+sqlAdminUpdate)
       con.query(sqlAdminUpdate, function (err, result) {
           console.log(result);
           if (err) throw err;
           try {
             } catch ( err){
               console.log(err);
             }
              
         });
     }
     );
 
 }

 //app.post('/groupexist', function (req, res){
const groupexist = (req, res) =>{
  console.log("request - check if group exist " + req.body);
  const groupname = Object.values(req.body.groupname).toString().replaceAll(',','');

  const sqlGroup = "select count(*) as groupcount from nodelogin.group where groupname='"+groupname+"'";
  
  var msg='';
  console.log(sqlGroup);
  con.query(sqlGroup ,
  function(err, rows){
      if(err) throw err;

     // var resultStr = rows."count(*)";
      console.log( "Duplicate found for "+groupname+" : " +rows[0].groupcount);
      
      var duplicate = rows[0].groupcount
      console.log("Duplicate group found for "+groupname+" :"+duplicate);
     // var duplicate = parseInt(duplicate);

      if (duplicate!=0){
       console.log("Duplicate found will not create group")
        
      } else {
      }
      res.send(rows[0]);
  })

}

//app.post('/groupassign', function (req, res){
const groupassign = (req, res) => {
  console.log("request - assign group " + req.body);
  const groupname = Object.values(req.body.groupname).toString().replaceAll(',','').replaceAll(' ', '' )
  const groupname2 = req.body.groupname.split(" ")[1];
  const username = Object.values(req.body.username).toString().replaceAll(',','');
//  const role = Object.values(req.body.role).toString().replaceAll(',','');
  // check duplicates

  console.log("username "+username)
  console.log("groupname2 "+groupname2)
  console.log("groupname "+groupname)

  const sqlCheckDuplicateUser = "select count(*) as duplicate_member from nodelogin.group_assign "+
  "where groupname='"+groupname+"' and username='"+username+"'";
  
  var duplicateMember = true;
  try {
    con.query(sqlCheckDuplicateUser, function (err, result) {
     if (err) throw err;
     var duplicateUser = result[0].duplicate_member;

     if (duplicateUser!=0){
      console.log("Duplicate username "+username+ " found in "+groupname +" : "+ duplicateUser)
     
     
      console.log("duplicate member "+ duplicateMember)
      res.send(result);
     } else {
  
        const sqlAssignGroup = "insert into nodelogin.group_assign ( username, groupname, admin ) values ('"+username+"','"+groupname+"',false);";
       // const sqlAssignGroup2 = `insert into nodelogin.group_assign ( username, groupname, admin ) values ("${username}","${groupname}",false);`;
        console.log("Inserting into "+sqlAssignGroup);
      try {
      con.query(sqlAssignGroup, function (err, result) {
       if (err) throw err;
       return result;
       });
      
      } catch (err){
        console.log("checkExisting - Error in inserting group_assign")
        console.log(err);
      }

     
     }

     });

    
    } catch (err){
      console.log("assign user to group - Error querying group_assign")
      console.log(err);
    } 
  
  }


  const groupadminassign = (req, res) => {
    console.log("request - assign group admin to user" + req.body);
    const groupname = Object.values(req.body.groupname).toString().replaceAll(',','');
    const username = Object.values(req.body.username).toString().replaceAll(',','');
    console.log ("Assign user "+username+" as admin in "+groupname)
    // check duplicates
  
    const sqlCheckDuplicateUser = "select count(*) as duplicate_member from nodelogin.group_assign "+
    "where groupname='"+groupname+"' and username='"+username+"'";
    console.log ("Check if user is in group "+sqlCheckDuplicateUser)
    //var duplicateMember = true;
    var duplicateUser = 0
    try {
      con.query(sqlCheckDuplicateUser, function (err, result) {
       if (err) throw err;
       duplicateUser=result[0].duplicate_member;
       console.log("User found "+duplicateUser)
        
       if (duplicateUser==0){
        console.log("No user "+username+" found in group "+groupname)
       
        res.send(result);
       } else {
        
       
        console.log("User "+username+" found in group "+groupname)
       
      const sqlUpdateAdmin = "update nodelogin.group_assign set group_role ='admin' where groupname='"+groupname+"' and username='"+username+"';";
      console.log("Update admin "+sqlUpdateAdmin);
        try {
        con.query(sqlUpdateAdmin, function (err, result) {
         if (err) throw err;
         return result;
         });
        
        } catch (err){
          console.log("groupadminassign - Error in updating admin role")
          console.log(err);
        }
  
       
       }
  
       });
  
      
      } catch (err){
        console.log("assign user to group - Error querying group_assign")
        console.log(err);
      } 
    
    }
  
    const adminunassign = (req, res) => {
      console.log("request - remove admin from user" + req.body);

      // const username = req.body.username.split(" ")[1];
      //const groupname = Object.values(req.body.groupname).toString().replaceAll(',','');
      const username = Object.values(req.body.username).toString().replaceAll(',','');
      console.log ("Remove user "+username+" as admin")
         
        const sqlUpdateAdmin = "update nodelogin.group_assign set admin='N' where username='"+username+"';";
        console.log("Update admin "+sqlUpdateAdmin);
          try {
          con.query(sqlUpdateAdmin, function (err, result) {
           if (err) throw err;
           return result;
           });
          
          } catch (err){
            console.log("groupadminassign - Error in updating admin role")
            console.log(err);
          }
    
         
  }
    
         
    
        
       
      
      
    
    
    //app.post('/userexist', function(req, res){
    const userexist =  (req, res) => {
       const username = Object.values(req.body.username).toString().replaceAll(',','');
       const sql = "select count(*) as usercount from "
       + "nodelogin.accounts where username ='"+username+"'";
       console.log("check user exist "+sql);
       con.query(sql ,
       function(err, rows){
           if(err) throw err;
           console.log(rows[0].usercount);
           res.send(rows[0]);
       });
    
    }

    //app.post('/groupremove', function(req, res){

    

  module.exports= 
  {
   
    createapp,
    checkapp,
    listapp,
    updateapp
    }