var express= require('express');
var cors = require('cors');

var app = express();
var mysql = require('mysql');

// TODO : split into route and put env into a file import env file
var port = process.env.PORT || 8080;
console.log (port);
app.use(cors());
app.use('/assets',express.static(__dirname+'/public'));
app.use(express.json());

var con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"password",
    database:"nodelogin"
});

app.post('/activate', function(req, res){
    
  console.log("Activate or unactivate user :"+req.body);
  const activate = Object.values(req.body.active).toString().replaceAll(',','');
  const username = Object.values(req.body.username).toString().replaceAll(',','')
  
   console.log("user name "+ username+ " update "+activate);
   
   // check if username and/or email exist
   const sqlActivate = "update nodelogin.accounts set active = '"+activate+"' where username ='"+username+"'";
   
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
});

app.post('/updatepass', function(req, res){
    
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
});

app.post('/updateemail', function(req, res){
    
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
});

app.post('/profile', function(req, res){
   
  console.log("request - extracting profile " + req.body);
  const username = Object.values(req.body.username).toString().replaceAll(',','');
  
  // console.log(username);

   const sql = "select email, password from "
   + "nodelogin.accounts where username ='"+username+"'";
   console.log(sql);
   con.query(sql ,
   function(err, rows){
       if(err) throw err;
       console.log(rows);
       res.send(rows);
   });

});

app.post('/groupassign', function (req, res){
  console.log("request - assign group " + req.body);
  const groupname = Object.values(req.body.groupname).toString().replaceAll(',','');
  const username = Object.values(req.body.username).toString().replaceAll(',','');
      
  // check duplicates

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
      const role = "member";
      const id = parseInt(Math.random()*1000000)
      
      const sqlAssignGroup = "insert into nodelogin.group_assign ( assign_id, username, groupname, group_role ) values ('"+id+"','"+username+"','"+groupname+"','"+role+"');";
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
)



app.post('/checkgroup', function (req, res){
  console.log("request - checking group "+ req.body);
  const groupname = Object.values(req.body.groupname).toString().replaceAll(',','');
  const sqlGroup  = "select username from nodelogin.group_assign where groupname='"+groupname+"'";
  console.log("checkusergroup - check "+groupname);
 
  // check user's group
  console.log(sqlGroup);
  con.query(sqlGroup ,
  function(err, rows){
      if(err) throw err;
      console.log(rows);
 
      res.send(rows);
  });
 
 
 })

app.post('/checkusergroup', function (req, res){
 console.log("request - checking user group "+ req.body);
 const username = Object.values(req.body.username).toString().replaceAll(',','');
 const sqlUserGroup  = "select group, username from nodelogin.group where name='"+username+"'";
 console.log("checkusergroup - check "+sqlUserGroup);

 // check user's group
 console.log(sqlUserGroup);
 con.query(sqlUserGroup ,
 function(err, rows){
     if(err) throw err;
     console.log(rows);

     res.send(rows);
 });


})


app.post('/groupexist', function (req, res){
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

      //   const id = parseInt(Math.random()*100000)
        
      //   const sqlInsertGroup = "insert into nodelogin.group ( id ,groupname ) values ('"+id+"','"+groupname+"');";
      //  console.log("Inserting into "+sqlInsertGroup);
      //   try {
      //   con.query(sqlInsertGroup, function (err, result) {
      //    if (err) throw err;
      //    });
      //   } catch (err){
      //     console.log("checkExisting - Error in inserting  nodelogin.accounts")
      //     console.log(err);
      //   }

      }
      res.send(rows[0]);
  })

 
 // res.json({msg:""+msg+""})

})

app.post('/creategroup', function (req, res){
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

        const id = parseInt(Math.random()*100000)
        
        const sqlInsertGroup = "insert into nodelogin.group ( id ,groupname ) values ('"+id+"','"+groupname+"');";
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

 
 // res.json({msg:""+msg+""})

})

app.post('/byemail', function(req, res){
   
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

});



app.post('/byusername', function(req, res){
   
  console.log("request - extracting username, active, admin, email " + req.body);
  const username = Object.values(req.body.username).toString().replaceAll(',','');
  
   const sql = "select username, email, active, admin from "
   + "nodelogin.accounts where username ='"+username+"'";
   console.log(sql);
   con.query(sql ,
   function(err, rows){
       if(err) throw err;
       console.log(rows[0]);
       res.send(rows[0]);
   });

});


app.post('/email', function(req, res){
   
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

});


app.post('/admin', function(req, res){
   
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

});

app.post('/userexist', function(req, res){
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

})


app.post('/login', function(req, res){
   
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
  

});

app.post('/updateadm', function(req, res){
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

})


app.post('/newuser', function(req, res){
    
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
                
                 duplicate = duplicate + " email=true";
                 console.log("checkExisting - duplicate for email "+ duplicate);
                 
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
              
           });
           
       });
 });
 


 app.post('/groupremove', function(req, res){
  console.log("removing user from group :"+req.body);
  const username = Object.values(req.body.username).toString().replaceAll(',','');
  const groupname = Object.values(req.body.groupname).toString().replaceAll(',','');

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

})


app.get('/', function(req, res){

    con.query('select id, username, password email from nodelogin.accounts',
    function(err, rows){
        if(err) throw err;
        console.log(rows);
    });
   

    res.send('<html><head><link href=assets/style.css type=text/css rel=stylesheet/><h1>Hello Jesus</h1></head></html>')
});

app.get('/person/:id', function(req, res){
    console.log("Request Url "+req.url);
    res.send('<html><head><link href=assets/style.css type=text/css rel=stylesheet/></head><body><h1>Person: '+
    req.params.id + '</h1></body></html>');
});

app.use('person/:id', function(req, res, next){
    console.log("Request Url : "+req.url);
      

})
app.get('/api',function(req, res){
    res.json({firstname:'John', lastname:'Doe'});
});

app.listen(port);

function checkExisting(username, email){
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
               
                duplicate = duplicate + " email=true";
                console.log("checkExisting - duplicate for email "+ duplicate);
                
              } catch ( err){
                console.log(err);
                console.log("checkExisting -err in checking email ");
                
              }
              console.log("checkExisting - username and email : "+ duplicate);
             
              
             
          });
          
      });
      
     
}

// var CryptoJS = require("crypto-js");

// var ciphertext = CryptoJS.AES.encrypt('test', 'secretkey34').toString();

// console.log("ciphertext : "+ciphertext);

// var bytes = CryptoJS.AES.decrypt(ciphertext, 'secretkey34' );

// var originalText = bytes.toString(CryptoJS.enc.Utf8);

// console.log(originalText);


function passwordEncrypt (myPlaintextPassword){
  const bcrypt = require('bcrypt');
  const saltRounds = 10;

  const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);
  console.log("passwordEncrypt - "+hash);
  return hash;
}



function checkEmail(email){

    sqlEmail = "select email from "
     + "nodelogin.accounts where email ='"+email+"'";


     con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        con.query(sqlEmail, function (err, result) {
          if (err) throw err;
          console.log("Result for email : " + result[0].email);
          if( result[0].email!="" ){
            return "email";
          }
        });
      });
     
     
}