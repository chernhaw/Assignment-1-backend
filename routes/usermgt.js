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
// env.ok(function(err) {
//   if (!err) return
//   console.error(err)
//   process.exit(1)
// })

// function handleEnv (err) {
//   if (!err) return
//   process.exit(1)
// }


 var con = mysql.createConnection({
 // host:process.env.HOST,
 //user:process.env.USER,
  user:"root",
  password:"password",
 //password:process.env.PASSWORD,

  database:"nodelogin"
// database:process.env.DATABASE
 } );


// app.post('/email', function(req, res){
   
//   console.log("request - extracting email " + req.body);
//   const username = Object.values(req.body.username).toString().replaceAll(',','');
  
//    const sql = "select email from "
//    + "nodelogin.accounts where username ='"+username+"'";
//    console.log(sql);
//    con.query(sql ,
//    function(err, rows){
//        if(err) throw err;
//        console.log(rows[0].email);
//        res.send(rows[0]);
//    });

// });

//app.post('/updateemail', function(req, res){
const updateemail =(req,res)=>{
  console.log("Update email request :"+req.body);
  const username = Object.values(req.body.username).toString().replaceAll(',','');
  
  const email = Object.values(req.body.email).toString().replaceAll(',','');
   console.log("user name "+ username);
   console.log("new email "+ email);

   // check if username and/or email exist
   const sqlEmail = "select count(*) as duplicateemail from "
    + "nodelogin.accounts where email ='"+email+"' and username not in ('"+username+"')";
   

    console.log("Check if email already used sql "+sqlEmail)
   
   con.connect(function(err) {
     //  if (err) throw err;
       console.log("Connected!");
       con.query(sqlEmail, function (err, result) {
           
        //   if (err) throw err;
           try { 
               console.log("Duplicate count found "+result[0].duplicateemail)
              if (result[0].duplicateemail!=0){
             // if (typeof(result)!="undefined"){
               
                console.log("duplicate email found, will not update email address, feedback to front end");
              // console.log("checkExistingEmail - duplicate for email "+ duplicate);
                res.send(result);
              } else {
                // procees to update
                const sqlEmailUpdate = "update nodelogin.accounts set email = '"+email+"' where username  = '"+username+"'"
                console.log("Update email sql : "+sqlEmailUpdate);
                con.query(sqlEmailUpdate, function (err, result) {
             //   console.log("Result of update "+result);        
                 });
                      
              }

             } catch ( err){
               console.log(err);
               console.log("checkExistingEmail -err in checking email ");
               
             }
            
         });
     }
     );
};

const email = (req, res)=>{
   
    console.log("request - extracting email " + req.body);
    const username = Object.values(req.body.username).toString().replaceAll(',','');
    
     const sql = "select email from "
     + "nodelogin.accounts where username ='"+username+"'";
     console.log(sql);
     con.query(sql ,
     function(err, rows){
         if(err) throw err;
         console.log(rows[0].email);
         res.send(rows[0]);
     });
  
  };

  const updatepass = (req, res) =>{
    console.log("Update password request :"+req.body);
    const username = Object.values(req.body.username).toString().replaceAll(',','');
    const password = Object.values(req.body.password).toString().replaceAll(',','')
    
     console.log("user name "+ username);
     console.log("new password "+ password);
    //Encrypt password
  
    const encryPass = passwordEncrypt(password);
     
     // check if username and/or email exist
     const sqlPass = "update nodelogin.accounts set password = '"+encryPass+"' where username ='"+username+"'";
     
     con.connect(function(err) {
       //  if (err) throw err;
         console.log("Update password Connected!");
         console.log("Update password Run "+sqlPass)
         con.query(sqlPass, function (err, result) {
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



const login = (req, res)=>{
     
  console.log("login request : " + req.body);
  const username = Object.values(req.body.username).toString().replaceAll(',','');
  const password = Object.values(req.body.password).toString().replaceAll(',','');
   console.log("login request received: "+username);
   console.log("login request received: " +password);

   const bcrypt = require('bcrypt'); 
  // const saltRounds = 10;
  
   const sql = "select username, password, email, active from "
   + "nodelogin.accounts where username ='"+username+"'";
   console.log(sql);

  console.log ( "user:"+process.env.USER+
  
"/password:" +process.env.PASSWORD)
   con.query(sql ,
   function(err, rows){
    
       console.log("User returned "+rows.length)

       if (rows.length==0){
         res.json({msg:"no user found"})
       } else {
       var active = rows[0].active;
       hash = ""+rows[0].password+"";
       console.log("login - hash = "+hash);
       console.log("login - password = "+password);
       console.log("User is active "+ active);
     
      // res.json({msg:"no user found"})
     
      // console.log("login - email = "+email);
       bcrypt.compare(password, hash, (err, respass) => {
        
         console.log("login - respass = "+respass + " active= "+active); //true
        // res.json({firstname:'John', lastname:'Doe'});
        res.json({repass:""+respass + "", active:""+active+""});
       
     //    res.send()
       });
     }
   

      // res.send();
   });
  }
   //app.post('/updatepass', function(req, res){

const activate = (req, res)=>{
    
    console.log("Activate or unactivate user :"+req.body);
    
    const username = Object.values(req.body.username).toString().replaceAll(',','')
    
     console.log("user name "+ username+ " to activate");
     
     // check if username and/or email exist
     const sqlActivate = "update nodelogin.accounts set active = 'Y' where username ='"+username+"'";
     
     con.connect(function(err) {
       //  if (err) throw err;
        
         console.log("Update user activate Run "+sqlActivate);
         con.query(sqlActivate, function (err, result) {
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
  
  const deactivate = (req, res)=>{
    
    console.log("Deactivate user :"+req.body);
    
    const username = Object.values(req.body.username).toString().replaceAll(',','')
    
     console.log("user name "+ username+ " to deactivate");
     
     // check if username and/or email exist
     const sqlActivate = "update nodelogin.accounts set active = 'N' where username ='"+username+"'";
     
     con.connect(function(err) {
       //  if (err) throw err;
        
         console.log("Update user activate Run "+sqlActivate);
         con.query(sqlActivate, function (err, result) {
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

  const admin =(req, res)=>{
   
    console.log("request - extracting admin " + req.body);
    const username = Object.values(req.body.username).toString().replaceAll(',','');
    
     const sql = "select admin from "
     + "nodelogin.accounts where username ='"+username+"'";
     console.log(sql);
     con.query(sql ,
     function(err, rows){
         if(err) throw err;
         console.log(rows[0].admin);
         res.send(rows[0]);
     });
  
  }

  const listadminusers =(req, res)=>{
  
    console.log("request - extracting admin user list " + req.body);
    try {
     
   //   listuserssql = "select username as value, username as label from nodelogin.accounts"
      listuserssql = "SELECT distinct(username) FROM nodelogin.group_assign where admin = true"
      console.log("Get list of groups query" +listuserssql);
     con.query(listuserssql,
     function(err, rows){
         if(err) throw err;
         console.log(rows);
         res.send(rows);
     });
    } catch (err){
     console.log(err);
    }
  }


  
  //  const sqlListGroup = "select groupname from group where groupname like '%"+groupname+"%'";
  const listusers =(req, res)=>{
  
     console.log("request - extracting user list " + req.body);
     try {
      
    //   listuserssql = "select username as value, username as label from nodelogin.accounts"
       listuserssql = "select username from nodelogin.accounts"
       console.log("Get list of users query" +listuserssql);
      con.query(listuserssql,
      function(err, rows){
          if(err) throw err;
          console.log(rows);
          res.send(rows);
      });
     } catch (err){
      console.log(err);
     }
   }

const  listlistenabledusers =(req, res)=>{
  
  console.log("request - extracting active user list " + req.body);
  try {
   
 //   listuserssql = "select username as value, username as label from nodelogin.accounts"
    listuserssql = "select username from nodelogin.accounts where active ='Y'"
    console.log("Get list of users query" +listuserssql);
   con.query(listuserssql,
   function(err, rows){
       if(err) throw err;
       console.log(rows);
       res.send(rows);
   });
  } catch (err){
   console.log(err);
  }
}

   const listdisabledusers =(req, res)=>{
  
    console.log("request - extracting disabled user list " + req.body);
    try {
     
   //   listuserssql = "select username as value, username as label from nodelogin.accounts"
      listuserssql = "select username from nodelogin.accounts where active ='N'"
      console.log("Get list of users query" +listuserssql);
     con.query(listuserssql,
     function(err, rows){
         if(err) throw err;
         console.log(rows);
         res.send(rows);
     });
    } catch (err){
     console.log(err);
    }
  }

  const listgroup =(req, res)=>{
   var groupname =''
   var listgroupsql =''
    console.log("request - extracting grouplist " + req.body);
    try {
      groupname = Object.values(req.body.groupname).toString().replaceAll(',','');
      listgroupsql = "select groupname from nodelogin.group where groupname like '%"+groupname+"%'"
     
    } catch (err){
      listgroupsql = "select groupname from nodelogin.group"
    }
     
     console.log("Get list of groups query" +listgroupsql);
     con.query(listgroupsql ,
     function(err, rows){
         if(err) throw err;
         console.log(rows);
         res.send(rows);
     });
  
  }

  
      
  
  const newuser =(req, res)=>{
    
    console.log("new user :"+req.body);
    const username = Object.values(req.body.username).toString().replaceAll(',','');
    const password = Object.values(req.body.password).toString().replaceAll(',','');
    const email = Object.values(req.body.email).toString().replaceAll(',','');
    const admin = Object.values(req.body.admin).toString().replaceAll(',','');
     console.log(username);
     console.log(password);
     console.log(email);
     console.log(admin);

     var isAdmin ='N';
     if (admin){
        isAdmin='Y';
     } 
     // check if username and/or email exist
     const sqlName = "select username from "
     + "nodelogin.accounts where username ='"+username+"'";
 
     const sqlEmail = "select email from "
      + "nodelogin.accounts where email ='"+email+"'";
      var duplicate ="";
 
     con.connect(function(err) {
       //  if (err) throw err;
         console.log("Connected!");
         
         con.query(sqlName, function (err, result) {
           
          // if (err) throw err;
 
           try {
             console.log("checkExisting -Result for username : " + result[0].username);
             duplicate = duplicate + "name=true"
             console.log("checkExisting - duplicate for username "+ duplicate);
           } catch ( err){
             console.log("checkExisting - err in checking username");
           }
         });
 
       
         con.query(sqlEmail, function (err, result) {
             
          //   if (err) throw err;
             try {
                
                 console.log("checkExisting -Result for email : " + result[0].email);
                 if (email.length!=0){
                 duplicate = duplicate + " email=true";
                 
                 console.log("checkExisting - duplicate for email "+ duplicate);
                } else {
                  console.log("Email not provided")
                }
                 
               } catch ( err){
                 console.log(err);
                 console.log("checkExisting -err in checking email ");
                 
               }
               console.log("checkExisting - username and email : "+ duplicate);
             
               if (duplicate.length==0){
                // not duplicate insert data into nodelogin.accounts
                console.log("checkExisting - inserting username, email and password into nodelogin.accounts");
               
                const encryPass = passwordEncrypt(password);
                
                sqlInsert = "insert into nodelogin.accounts ( username, password, email, admin, active) values ('"+username+"','"+encryPass+"','"+email+"','"+isAdmin+"','Y');";
                console.log("checkExisting - "+sqlInsert);
                try {
                con.query(sqlInsert, function (err, result) {
                 // if (err) throw err;
                 });
                } catch (err){
                  console.log("checkExisting - Error in inserting nodelogin.accounts")
                  console.log(err);
                }

               }
               if (duplicate.length!=0){
                res.send(duplicate);
               }
              
           }
           
           );
           
       });
 };

 

const checkgroup = (req, res)=>{
 console.log("request - checking user group "+ req.body);
 var groupname;
 try {
  groupname = Object.values(req.body.groupname).toString().replaceAll(',','');
 } catch (err){
  groupname="";
 }

 var checkadmin;
 try {
  checkadmin = Object.values(req.body.admin).toString().replaceAll(',','');
 } catch (err){
  checkadmin="";

 }

 const username = Object.values(req.body.username).toString().replaceAll(',','');
 var sqlUserGroupRole 
 if (groupname.length==0){
    sqlUserGroupRole  = "select count(*) as admin from nodelogin.group_assign where username='"+username+"' and admin=true";
 } else {
  sqlUserGroupRole  = "select count(*) as admin from nodelogin.group_assign where username='"+username+"' and groupname='"+groupname+"' and admin=true";
 }

 if (checkadmin.length==0){
  sqlUserGroupRole  = "select count(*) as usercount from nodelogin.group_assign where username='"+username+"' and groupname='"+groupname+"'";
}
  
 
 console.log("checkusergroup - check "+sqlUserGroupRole);

 // check user's group
 console.log("check user group : "+sqlUserGroupRole);
 con.query(sqlUserGroupRole ,
 function(err, rows){
     if(err) throw err;

     if (checkadmin.length==0){
      console.log("User count "+rows[0].usercount)
      res.send(rows);
    } else {
     console.log("Admin count " +rows[0].admin);
     res.send(rows);
    }
 });
};

const adminassign = (req, res)=>{
  console.log("request - assign admin to user " + req.body);
  const username = Object.values(req.body.username).toString().replaceAll(',','').replaceAll(' ','');
  

  const sqlAdmin = "update group_assign set admin = true where username ='"+username+"'";
  console.log(sqlAdmin);
 con.query(sqlAdmin ,
 function(err, rows){
     if(err) throw err;
     console.log(rows);
     res.send(rows);
 });
};

//const creategroup = 
//app.post('/creategroup', function (req, res){

  const creategroup = (req, res)=>{
  console.log("request - create new group " + req.body);
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

      //  const id = parseInt(Math.random()*100000)
        
        const sqlInsertGroup = "insert into nodelogin.group (groupname ) values ('"+groupname+"');";
       console.log("Inserting into "+sqlInsertGroup);
        try {
        con.query(sqlInsertGroup, function (err, result) {
         if (err) throw err;
         });
        } catch (err){
          console.log("checkExisting - Error in inserting  nodelogin.accounts")
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





//app.post('/byemail', function(req, res){
const byemail =  (req, res)=>{
  console.log("request - extracting username, active, admin, email " + req.body);
  const email = Object.values(req.body.email).toString().replaceAll(',','');
  
   const sql = "select username, email, active, admin from "
   + "nodelogin.accounts where email ='"+email+"'";
   console.log(sql);
   con.query(sql ,
   function(err, rows){
       if(err) throw err;
       console.log(rows[0]);
       res.send(rows[0]);
   });

};


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
         
        const sqlUpdateAdmin = "update nodelogin.group_assign set admin=false where username='"+username+"';";
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

    const groupremove = (req,res)=>{
      console.log("removing user from group :"+req.body);
      const username = Object.values(req.body.username).toString().replaceAll(',','').replaceAll(' ','');
      const groupname = Object.values(req.body.groupname).toString().replaceAll(',','').replaceAll(' ','');
    
       console.log("removing "+username+" from "+groupname)
         // check if username and/or email exist
     const sqlRemoveAssignment = "delete from nodelogin.group_assign where username ='"+username+"' and groupname ='"+groupname+"'";
     
     con.connect(function(err) {
       //  if (err) throw err;
        
         console.log("Update user admin "+sqlRemoveAssignment)
         con.query(sqlRemoveAssignment, function (err, result) {
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
    

  module.exports= 
  {activate,
    deactivate,
    login, 
    email, 
    admin, 
    updateemail,
    updatepass, 
    newuser, 
    byemail, 
    byusername, 
    updateadm, 
    checkgroup,
    creategroup,
    groupexist,
    groupassign,
    userexist,
    listgroup,
    groupremove,
    adminassign,
    adminunassign,
    groupedit,
    listadminusers,
    listusers,
    listlistenabledusers,
    listdisabledusers}