var mysql = require('mysql');

var nodemailer = require('nodemailer')

var transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {

    user: 'chernhaw@hotmail.com',
    pass: 'Psalm31:1'

  }
});
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


 const listplans = (req, res)=>{
    console.log("request - query app " + req.body);
   
    const sql_list_plan = "select plan_app_acronym from nodelogin.plan";
  
    console.log("check plan "+ sql_list_plan);
    con.query(sql_list_plan,
    function(err, rows){
  
        if(err) throw err;
        console.log(rows[1].plan_app_acronym)
        res.send(rows)
    })
  }

var hasAccess =""
 const checkplan = (req, res)=>{

  console.log("request - query plan " + req.body);
  var app_acronym=null
  try{
  app_acronym = Object.values(req.body.app_acronym).toString().replaceAll(',','');
  plan_mvp_name = Object.values(req.body.plan_mvp_name).toString().replaceAll(',','');
  }catch (err){
    console.log("There is an error "+err)
  }

  const plan_app_acronym=""+plan_mvp_name+app_acronym+""
  const sql_check_plan = "select count(*) as duplicate from nodelogin.plan where plan_app_acronym='"+plan_app_acronym+"'";

  console.log("check plan : "+ sql_check_plan);
  con.query(sql_check_plan,
  function(err, rows){

      if(err) throw err;
      console.log("plan duplicate result "+rows[0].duplicate);
     // app_startdate, app_enddate, app_permit_open, app_permit_todolist, app_permit_doing, app_permit_done from nodelogin.application where app_acronym='"+app_acronym+"'";
     res.send(rows)
  })
}

const retrieveplan = (req, res)=>{

    console.log("request - query plan " + req.body);
    var plan_app_acronym=null
    try{
        plan_app_acronym = Object.values(req.body.plan_app_acronym).toString().replaceAll(',','');
    
    }catch (err){
      console.log("There is an error "+err)
    }
  
   // const plan_app_acronym=""+plan_mvp_name+app_acronym+""
    const sql_retrieve_plan = "select plan_app_acronym, plan_startdate, plan_enddate from nodelogin.plan where plan_app_acronym='"+plan_app_acronym+"'";
  
    console.log("retrieve plan "+ sql_retrieve_plan);
    con.query(sql_retrieve_plan,
    function(err, rows){
  
        if(err) throw err;
      //  console.log("retrieve result "+rows);
        console.log("retrieve rows "+rows[0].plan_app_acronym);
        console.log("retrieve rows "+rows[0].plan_startdate);
        console.log("retrieve rows "+rows[0].plan_enddate);
       // app_startdate, app_enddate, app_permit_open, app_permit_todolist, app_permit_doing, app_permit_done from nodelogin.application where app_acronym='"+app_acronym+"'";
       res.send(rows)
    })
  }


const getTaskDetail = (req, res)=>{
  console.log("request - get task detail  " + req.body);
  const task_id = Object.values(req.body.task_id).toString().replaceAll(',','').replaceAll("'","^");
  const sql_get_task_detail = "select "+
  "task_id, "+
  "task_name, "+
  "task_description, "+
  "task_notes, "+
  "task_plan, "+
  "task_app_acronym, "+
  "task_state, "+
  "task_creator, "+
  "task_owner, "+
  "task_createDate "+
  "from nodelogin.task where task_id='"+task_id+"'"

  try {
    con.query(sql_get_task_detail, function (err, result) {
     if (err) throw err;

      console.log("Retrieved task details ")
      console.log("task_id :"+result[0].task_id)
      console.log("task_description :"+result[0].task_description)
      console.log("task_notes :"+result[0].task_notes)
      console.log("task_plan :"+result[0].task_plan)
      console.log("task_app_acronym :"+result[0].task_app_acronym)
      console.log("task_state :"+result[0].task_state)
      console.log("task_owner :"+result[0].task_owner)
      console.log("task_createDate :"+result[0].task_createDate)
     res.send(result)
     });
    } catch (err){
      console.log("error in extracting task detail - "+task_id)
      console.log(err);
    }
}



const apptaskid = (req, res)=>{
    var app_acronym = Object.values(req.body.app_acronym).toString().replaceAll(',','');
    app_acronym=app_acronym+"_"
    console.log("Get tasks for app "+app_acronym)

    var sqlCountTaskApp = "select task_id from nodelogin.task where task_id like '"+app_acronym+"%' order by task_id";

  try {
    console.log("sql "+ sqlCountTaskApp)
   
    con.query(sqlCountTaskApp, function (err, result) {
        if (err) throw err;
        
       
        res.send(result)
        
     }); 
    } catch (err){
        console.log("check task count")
        console.log(err);
      }
}


const getAllTasksByPlan = (req, res)=>{
  const plan = Object.values(req.body.plan).toString().replaceAll(',','');
  console.log("getting plan: "+plan)
  const sqlGetPlanTasks = "select task_id, task_name, task_state from nodelogin.task where task_plan ='"+plan+"' order by task_state"
  try {
    console.log("sql query plan: "+sqlGetPlanTasks)
    con.query(sqlGetPlanTasks, function (err, result) {
        if (err) throw err;
        
       
        for ( var i=0; i<result.length; i++){
          console.log("Task id :"+result[i].task_id)
          console.log("Task name :"+result[i].task_name)  
          console.log("Task status :"+result[i].task_state)             
          console.log("-----------------------------")
       } 
       res.send(result)
   
    })
  } catch (err){
    console.log("getting app task - Error checking")
    console.log(err);
  }

}

const getAllTasksByApp = (req, res)=>{
  const app_acronym = Object.values(req.body.app_acronym).toString().replaceAll(',','').replaceAll("'","^");
  console.log("getting app_acronym task : "+app_acronym)
  const sqlGetAppTasks = "select task_id, task_name, task_state from nodelogin.task where task_app_acronym ='"+app_acronym+"' order by task_state"
  try {
    con.query(sqlGetAppTasks, function (err, result) {
        if (err) throw err;
        
       
        for ( var i=0; i<result.length; i++){
          console.log("Task id :"+result[i].task_id)
          console.log("Task name :"+result[i].task_name)  
          console.log("Task status :"+result[i].task_state)             
          console.log("-----------------------------")
       } 
       res.send(result)
   
    })
  } catch (err){
    console.log("getting app task - Error checking")
    console.log(err);
  }

}



function checkTaskAccess(user, access_type, app_acronym){

  console.log("Checking access ")
  
  
  console.log("app_acronym "+app_acronym)
 
  console.log("access_type "+access_type)
  console.log("user "+user)
  // create query for application table

  var sqlAccess = ""
  var groupnamesStr =""

  // Step 1 get group permit access in open/todo/doing/Done from appliaction table
  if (access_type == "Create"){
   
  }else if (access_type == "Open"){
    sqlAccess= "select app_permit_open as access from nodelogin.application where app_acronym ='"+app_acronym+"'"
  } else if (access_type == "Todo"){
    sqlAccess= "select app_permit_todolist as access from nodelogin.application where app_acronym ='"+app_acronym+"'"
  
  } else if (access_type == "Doing"){

    sqlAccess= "select app_permit_doing as access from nodelogin.application where app_acronym ='"+app_acronym+"'"

  } else if (access_type == "Done"){
    sqlAccess= "select app_permit_done as access from nodelogin.application where app_acronym ='"+app_acronym+"'"
  } else if (access_type == "Close"){
    access_type = "Done"
    sqlAccess= "select app_permit_done as access from nodelogin.application where app_acronym ='"+app_acronym+"'"
  }
   console.log("Access type "+access_type)
   console.log("Running query "+sqlAccess)

    con.query(sqlAccess, function (err, result) {
        if (err) throw err;
        
         
         
          try {

          console.log("Task id access for"+access_type +" is : "+result[0].access)
          groupnamesStr="'"+result[0].access.toString().replaceAll(" ","','")+"'"
         
       //   groupnamesStr="'"+groupnamesStr.toString().replaceAll("'',", "")
       // split result into array
         console.log("groupnamesStr "+groupnamesStr)

          } catch {
            res.send("No access")
          }
    
       /////////////////NAR BEI ANOTHER NESTED SQL
      // Step 2 get groupmembers in these groups 

      if (groupnamesStr!=""){
       const sqlAccessMember = "select username as access from nodelogin.group_assign where groupname in ("+groupnamesStr+")"
       console.log("Sql to check member is for access "+sqlAccessMember)
       var userNames =""
       con.query(sqlAccessMember, function (err, result) {

      
        if (err) throw err;
        
          console.log("Members in groups "+groupnamesStr +" query with "+sqlAccessMember)
         
          for ( var i=0; i<result.length; i++){
            userNames = userNames+" "+result[i].access
            console.log("Username : "+result[i].access)
                      
          }
          console.log("Usernames found in "+groupnamesStr+ " is "+userNames)
          console.log("check task access "+userNames.indexOf(user))
          
        var res
       var hasAccess= userNames.indexOf(user)
            if (hasAccess>-1){
              res.sendStatus(403)
            }
          
       })
      }
    }
   
    );
}








const taskaccess = (req, res)=>{
  console.log("Checking access ")
  
  var app_acronym = req.body.app_acronym.toString()
  console.log("app_acronym "+app_acronym)
  var access_type = req.body.access_type.toString()
  console.log("access_type "+access_type)
  // create query for application table

  var sqlAccess = ""
  var groupnamesStr =""

  // Step 1 get group permit access in open/todo/doing/Done from appliaction table
  if (access_type == "Create"){
    sqlAccess= "select app_permit_create as access from nodelogin.application where app_acronym ='"+app_acronym+"'"
  }else if (access_type == "Open"){
    sqlAccess= "select app_permit_open as access from nodelogin.application where app_acronym ='"+app_acronym+"'"
  } else if (access_type == "Todo"){
    sqlAccess= "select app_permit_todolist as access from nodelogin.application where app_acronym ='"+app_acronym+"'"
  
  } else if (access_type == "Doing"){

    sqlAccess= "select app_permit_doing as access from nodelogin.application where app_acronym ='"+app_acronym+"'"

  } else if (access_type == "Done"){
    sqlAccess= "select app_permit_done as access from nodelogin.application where app_acronym ='"+app_acronym+"'"
  } else if (access_type == "Close"){
    access_type = "Done"
    sqlAccess= "select app_permit_done as access from nodelogin.application where app_acronym ='"+app_acronym+"'"
  }
   console.log("Access type "+access_type)
   console.log("Running query "+sqlAccess)

    con.query(sqlAccess, function (err, result) {
        if (err) throw err;
        
         
         
          try {

          console.log("Task id access for"+access_type +" is : "+result[0].access)
          groupnamesStr="'"+result[0].access.toString().replaceAll(" ","','")+"'"
         
       //   groupnamesStr="'"+groupnamesStr.toString().replaceAll("'',", "")
       // split result into array
         console.log("groupnamesStr "+groupnamesStr)

          } catch {
            res.send("No access")
          }
    
       /////////////////NAR BEI ANOTHER NESTED SQL
      // Step 2 get groupmembers in these groups 

      if (groupnamesStr!=""){
       const sqlAccessMember = "select username as access from nodelogin.group_assign where groupname in ("+groupnamesStr+")"
       console.log("Sql to check member is for access "+sqlAccessMember)
       var userNames =""
       con.query(sqlAccessMember, function (err, result) {

      
        if (err) throw err;
        
          console.log("Members in groups "+groupnamesStr +" query with "+sqlAccessMember)
         
          for ( var i=0; i<result.length; i++){
            userNames = userNames+","+result[i].access
            console.log("Username :"+result[i].access)
                      
          }
          console.log("Usernames found in "+groupnamesStr+ " is "+userNames)

          res.send(result)
       })
      }
    }
   
    );
   
  }
 
  
 
const updateTask_App = (req, res)=>{

  console.log("Update task ")
  const app_acronym = Object.values(req.body.app_acronym).toString().replaceAll(',','').replaceAll("'","^");
  console.log("task for app "+app_acronym)
  const taskplan = Object.values(req.body.taskPlan).toString().replaceAll(',','').replaceAll("'","^");;
  console.log("set plan for task "+taskplan)
  
  const taskName = Object.values(req.body.taskName).toString().replaceAll(',','');
  console.log("Taskname "+taskName)

  const taskdescription = Object.values(req.body.taskDescription).toString().replaceAll(',','').replaceAll("'","^");;
  console.log("Task description "+taskdescription)

  const taskstate=Object.values(req.body.taskState).toString().replaceAll(',',''); 
  console.log("Task state "+taskstate)
  
  const taskNotes=Object.values(req.body.taskNotes).toString().replaceAll(',','').replaceAll("'","^");
  console.log("Task notes "+taskNotes)

  const taskOwner=Object.values(req.body.taskOwner).toString().replaceAll(',',''); 
  console.log("Task owner "+taskOwner)
  
  const taskId=Object.values(req.body.taskId).toString().replaceAll(',',''); 
  console.log("Task Id "+taskId)

  var taskemail = ""

 
  

  var sqlUpdateTask = "update nodelogin.task "
  + "set task_name='"+taskName
  +"', task_description ='"+taskdescription
  +"', task_plan ='"+taskplan
  +"', task_state = '"+taskstate
  +"', task_notes = '"+taskNotes
  +"', task_owner = '"+taskOwner
  +"' where task_id ='"+taskId+"'"

  try {
    
    con.query(sqlUpdateTask, function (err, result) {
        if (err) throw err;
       
        console.log("Run update task  "+sqlUpdateTask)

   
        // send email to task lead when task is moved to Done
        if (taskstate == "Done"){
           // Get email from task owner
         var sqlGetEmail = "select a.email from nodelogin.accounts a inner join nodelogin.task b "+ 
        "on a.username = b.task_creator where b.task_id= '"+taskId+"'"

          try {
    
            con.query(sqlGetEmail, function (err, result) {
                if (err) throw err;
                console.log("Run update task  "+sqlUpdateTask)
                taskemail=result[0].email

                console.log("Sending to task is done to "+taskemail)
          var mailOptions = {
            from: 'chernhaw@hotmail.com',
            to:''+taskemail+'',
            subject: 'Task '+taskId+ ' is done',
            text: 'Hi Lead,\nTask '+taskId+' is completed by '+taskOwner+ ' and awaiting for your further action.\n'
            +'Thanks.\n\n'
            +'Regards,\n'
            +'TMS'
          };
           
        
          transporter.sendMail(mailOptions, function(error, info){
            console.log("Sending email: "+info)
            if (error) {
              console.log("Error sending mail "+error)
            } else {
              console.log("Email sent"+info.response)
            }
            
          });
        
               });}
            catch (err){
                  console.log("Update task - Error updating app task")
                  console.log(err);
          }
          
        }

       });

       
    }
 catch (err){
    console.log("Update task - Error updating app task")
    console.log(err);
  }

}


const updateTask = (req, res)=>{

  console.log("Update task ")
  const app_acronym = Object.values(req.body.app_acronym).toString().replaceAll(',','').replaceAll("'","^");
  console.log("task for app "+app_acronym)
  const taskplan = Object.values(req.body.taskPlan).toString().replaceAll(',','').replaceAll("'","^");;
  console.log("set plan for task "+taskplan)
  
  const taskName = Object.values(req.body.taskName).toString().replaceAll(',','');
  console.log("Taskname "+taskName)

  const taskdescription = Object.values(req.body.taskDescription).toString().replaceAll(',','').replaceAll("'","^");;
  console.log("Task description "+taskdescription)

  const taskstate=Object.values(req.body.taskState).toString().replaceAll(',',''); 
  console.log("Task state "+taskstate)
  
  const taskNotes=Object.values(req.body.taskNotes).toString().replaceAll(',','').replaceAll("'","^");
  console.log("Task notes "+taskNotes)

  const taskOwner=Object.values(req.body.taskOwner).toString().replaceAll(',',''); 
  console.log("Task owner "+taskOwner)
  
  const taskId=Object.values(req.body.taskId).toString().replaceAll(',',''); 
  console.log("Task Id "+taskId)

  var taskemail = ""

 
  

  var sqlUpdateTask = "update nodelogin.task "
  + "set task_name='"+taskName
  +"', task_description ='"+taskdescription
  +"', task_plan ='"+taskplan
  +"', task_state = '"+taskstate
  +"', task_notes = '"+taskNotes
  +"', task_owner = '"+taskOwner
  +"' where task_id ='"+taskId+"'"

  try {
    
    con.query(sqlUpdateTask, function (err, result) {
        if (err) throw err;
       
        console.log("Run update task  "+sqlUpdateTask)

   
        // send email to task lead when task is moved to Done
        if (taskstate == "Done"){
           // Get email from task owner
         var sqlGetEmail = "select a.email from nodelogin.accounts a inner join nodelogin.task b "+ 
        "on a.username = b.task_creator where b.task_id= '"+taskId+"'"

          try {
    
            con.query(sqlGetEmail, function (err, result) {
                if (err) throw err;
                console.log("Run update task  "+sqlUpdateTask)
                taskemail=result[0].email

                console.log("Sending to task is done to "+taskemail)
          var mailOptions = {
            from: 'chernhaw@hotmail.com',
            to:''+taskemail+'',
            subject: 'Task '+taskId+ ' is done',
            text: 'Hi Lead,\nTask '+taskId+' is completed by '+taskOwner+ ' and awaiting for your further action.\n'
            +'Thanks.\n\n'
            +'Regards,\n'
            +'TMS'
          };
           
        
          transporter.sendMail(mailOptions, function(error, info){
            console.log("Sending email: "+info)
            if (error) {
              console.log("Error sending mail "+error)
            } else {
              console.log("Email sent"+info.response)
            }
            
          });
        
               });}
            catch (err){
                  console.log("Update task - Error updating app task")
                  console.log(err);
          }
          
        }

       });

       
    }
 catch (err){
    console.log("Update task - Error updating app task")
    console.log(err);
  }

}
// const sendEmail=()=>{

//   if (taskstate == "Done"){
//   var mailOptions = {
//     from: 'chernhaw21@outlook.sg',
//     to:'chernhaw@gmail.com',
//     subject: 'Task '+task_id+ ' is done',
//     text: 'Hi Lead,\nTask '+task_id
//     +' is done and awaiting for your further action.\n'
//     +' Thanks.\n'
//     +'\nRegards,'
//     +'\nTMS'
//   };


//   transporter.sendEmail(mailOptions, function(error, info){
//     console.log("Sending email: "+info)
//     if (error) {
//       console.log("Error sending mail "+error)
//     } else {
//       console.log("Email sent"+info.response)
//     }
    
//   });
// }
// }

const checktaskexist = (req, res)=>{

  const app_acronym = Object.values(req.body.app_acronym).toString().replaceAll(',','').replaceAll("'",'^')
  const task_name = Object.values(req.body.task_name).toString().replaceAll(',','').replaceAll("'",'^')

  var checkTaskExistSql ="select count(*) as task from nodelogin.task where task_app_acronym like '%"+app_acronym+"' and task_name ='"+task_name+"'";

  try {
    console.log(checkTaskExistSql)
  con.query(checkTaskExistSql, function (err, result) {
    console.log("count for taskname " +result.task)
    res.send(result)
  });
} catch( err){
  console.log(err)
}
}

const createtask_app = (req, res)=>{
  console.log("request - create new task " + req.body);

  const username = req.body.username;
  const password = req.body.password;
  
  const app_acronym =req.body.app_acronym;
  console.log("Create task for app "+app_acronym)
  const taskplan = req.body.taskPlan;
  console.log("Create task for task "+taskplan)
  const taskdescription =req.body.taskDescription
  console.log("Task description "+taskdescription)
  const taskName = req.body.taskName
  console.log("Taskname "+taskName)
  var taskNotes=req.body.taskNotes
  const taskcreator=req.body.taskCreator
  console.log("Task creator "+taskcreator) 
  console.log("Task notes "+taskNotes)

  const bcrypt = require('bcrypt');

  const sql = "select username, password,  active from "
   + "nodelogin.accounts where username ='"+username+"'";
   console.log("Checking user "+sql);

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

  if (taskNotes=="undefined"){
    taskNotes="\n\n----------\nUser:"+taskcreator+", Current State: Create, Date and Time:"+Date()+"\n"
  }  else {
   
    taskNotes = taskNotes+"\n\n----------\nUser:"+taskcreator+", Current State: Create, Date and Time:"+Date()+"\n"
  }
  
  var rnum=0
  var sql_rnum = "select app_rnumber from nodelogin.application where app_acronym = '"+app_acronym+"'";

  try {
   
    console.log("sql "+ sql_rnum)
   
    con.query(sql_rnum, function (err, result) {
        if (err) throw err;
        
       rnum = parseInt(result[0].app_rnumber)

      console.log("current r_num " +rnum)

       var new_taskid = rnum
   
       new_taskid = app_acronym+"_"+new_taskid

      
       
     var sqlInsertTask = "insert into nodelogin.task "+
     "(task_name, task_description, task_id, task_notes, task_app_acronym, task_state, task_creator, task_owner, task_createDate )"+
     " values ('"+taskName+
     "','"+taskdescription
     +"','"+new_taskid
     
     + "','"+taskNotes +"/n "
     +"','"+app_acronym+
     "','Open', '"
     +taskcreator
     +"',null,"
     +"CURRENT_TIMESTAMP)"
     console.log("Creating new task sql "+sqlInsertTask)

     rnum=rnum+1
     var sql_updaternum = "update nodelogin.application set app_rnumber='"+rnum+"' where app_acronym = '"+app_acronym+"'";

     con.query(sql_updaternum, function (err, result) {
      if (err) throw err;
      console.log(result)
        res.send(result)
   })

     con.query(sqlInsertTask, function (err, result) {

      try { 
        if (err) throw err;
        res.send(result)
      } catch(err){
        console.log(err)
      }
       
        });
     })

  
    
    } catch (err){
    console.log("creating task - Error ")
    console.log(err);
  }
    
      }
    

      const promoteTask2Done =(req,res)=>{

        console.log("request - promote task to done " + req.body);
      
        const username = Object.values(req.body.username).toString().replaceAll(',','');
        const password = Object.values(req.body.password).toString().replaceAll(',','');
        const app_acronym = Object.values(req.body.app_acronym).toString().replaceAll(',','')
        const taskName = Object.values(req.body.taskName).toString().replaceAll(',','');

        const bcrypt = require('bcrypt'); 

        const sql = "select username, password, active from "
        + "nodelogin.accounts where username ='"+username+"'";
        
        console.log(sql);

        
        
        con.query(sql ,
          function(err, result){
        
        try{ 
         var active = result[0].active;
              hash = ""+result[0].password+"";
              console.log("login - hash = "+hash);
              console.log("login - password = "+password);
              console.log("User is active "+ active);

        } catch (err){
          console.log("Invalid user")
          res.status(401).json({"code":"401"})
          return
        }

        bcrypt.compare(password, hash, (err, respass) => {
        if (respass!=true){
          console.log("Incorrect password")
          res.status(401).json({"code":"401"})
        //  res.sendStatus(403)
          return
         }

         if (active!="Y"){
          console.log("User not active")
          res.status(401).json({"code":"401"})
          
          return
         }

         if (err) {
          console.log(err)
          res.status(500).json({"code":"500"})
         
          return
      }
        
        
       
         var sqlAccess= "select app_permit_doing as access from nodelogin.application where app_acronym ='"+app_acronym+"'"
         try{
         con.query(sqlAccess ,
          function(err, result){
            console.log("Task id access for Create is : "+result[0].access)
            groupnamesStr="'"+result[0].access.toString().replaceAll(" ","','")+"'"
            console.log("groupnamesStr "+groupnamesStr)

            if (groupnamesStr!=""){
              const sqlAccessMember = "select username as access from nodelogin.group_assign where groupname in ("+groupnamesStr+")"
              console.log("Sql to check member is for access "+sqlAccessMember)
              var userNames =""
              con.query(sqlAccessMember, function (err, result) {
       
              console.log("username "+username)
               if (err) throw err;
               
                 console.log("Members in groups "+groupnamesStr +" query with "+sqlAccessMember)
                
                 for ( var i=0; i<result.length; i++){
                   userNames = userNames+","+result[i].access
                   console.log("Username :"+result[i].access)
                             
                 }
                 console.log("Usernames found in "+groupnamesStr+ " is "+userNames)
                 console.log("Usernames found in "+userNames.indexOf(username))
                 
            

                 if (userNames.indexOf(username)==-1){
                  console.log("User not authorized")
                
                  res.status(403).json({"code":"403"})
                  return
                 }
                 var sqlcheckTaskatDoing = "select task_state, task_id from nodelogin.task where task_name = '"+taskName+"'"
                 console.log(sqlcheckTaskatDoing)

                 con.query(sqlcheckTaskatDoing, function (err, result) {
                 
                  try{
                  console.log("Task state "+result[0].task_state)
                  } catch (err){
                    console.log(err)
                    res.status(404).json({"error":"Task not found"})
                    return
                  }
                  if (result[0].task_state!="Doing"){
                    res.status(405).json({"code":"405"})
                    return
                  
                  
                  } else {

                    var sqlSetTaskatDoing = "update nodelogin.task set task_state='Done' where task_name = '"+taskName+"'"
                    console.log(sqlSetTaskatDoing)
                    try{
                    con.query(sqlSetTaskatDoing, function (err, result) {// query

                      var sqlGetEmail = "select a.email, a.username, b.task_name from nodelogin.accounts a inner join nodelogin.task b "+ 
                      "on a.username = b.task_creator where b.task_name= '"+taskName+"'"
                      
                      console.log("Getting email "+sqlGetEmail)
                      con.query(sqlGetEmail, function (err, result) {
                       var taskemail=result[0].email
                        var taskOwner=result[0].username
                        var taskname = result[0].task_name
                      var mailOptions = {
                        from: 'chernhaw@hotmail.com',
                        to:''+taskemail+'',
                        subject: 'Task '+result[0].task_name+ ' is done',
                        text: 'Hi Lead,\nTask '+result[0].task_name+' is completed by '+taskOwner+ ' and awaiting for your further action.\n'
                        +'Thanks.\n\n'
                        +'Regards,\n'
                        +'TMS'
                      };
                      
                      transporter.sendMail(mailOptions, function(error, info){
                        console.log("Sending email: "+info)
                        if (error) {
                          console.log("Error sending mail "+error)
                        } else {
                          console.log("Email sent"+info.response)
                        }
                        
                      });

                      if (err) throw err
                      res.status(200).json({"code":"200"})
                     
                    })  })
                  } catch (err){
                    console.log(err)
                    res.status(500).json({"code":"500"})
                  }
                  }

             })
                 
              })
             }

            //  var sqlcheckTaskatDoing = "select task_state from nodelogin.task where task_name = '"+taskName+"'"
            //  console.log(sqlcheckTaskatDoing)
             

          }) //

        } catch(err){
          console.log(err)
          res.status(500).json({"error":"Server error"})
          return
        }
        }
        
        )

      })
      }


      const getTaskbyState = (req, res)=>{

        const username = Object.values(req.body.username).toString().replaceAll(',','');
        const password = Object.values(req.body.password).toString().replaceAll(',','');
        const taskstate = Object.values(req.body.taskstate).toString().replaceAll(',','');
        const app_acronym = Object.values(req.body.app_acronym).toString().replaceAll(',','')
        const bcrypt = require('bcrypt'); 

        const correctStr = "OpenTodoDoingDoneClose"
        
        if (correctStr.indexOf(taskstate)==-1){
          console.log("Invalid task state "+ taskstate)
          res.status(400).json({"code":"400"})
          return
        }

        const sql = "select username, password, active from "
        + "nodelogin.accounts where username ='"+username+"'";
        
        console.log(sql);

        con.query(sql ,
          function(err, result){
            if (err) throw err;
         var active = result[0].active;
              hash = ""+result[0].password+"";
              console.log("login - hash = "+hash);
              console.log("login - password = "+password);
              console.log("User is active "+ active);

        bcrypt.compare(password, hash, (err, respass) => {
          if (respass!=true){
            console.log("Incorrect password")
            res.status(401).json({"code":"401"})
            //res.sendStatus(403)
            return
           } else 
  
           if (active!="Y"){
            console.log("User not active")
            res.status(401).json({"code":"401"})
           // res.sendStatus(403)
            return
           } else {
           
           var sqltasks= "select task_id, task_name, task_description, task_plan, task_notes, task_state, task_owner, task_createDate  from nodelogin.task where task_app_acronym ='"+app_acronym+"' and task_state='"+taskstate+"'"
           try{
           console.log(sqltasks)
            con.query(sqltasks,
              function(err, result){
                if (err) throw err;
                
                  result.push({"code":"200"})
                  res.status(200).json(result)
                 
                  return
              })
           
          } catch(err){
            console.log(err)
            res.status(500).json({"code":"500"})
           // res.sendStatus(500)
          }
        }
        })
      })
      }


          
          
      
      const createtask = (req, res)=>{
        console.log("request - create new task ext " + req.body);
      
        const username = Object.values(req.body.username).toString().replaceAll(',','');
        const password = Object.values(req.body.password).toString().replaceAll(',','');

        const app_acronym = Object.values(req.body.app_acronym).toString().replaceAll(',','')
        console.log("Create task for app "+app_acronym)
      //  const taskplan = Object.values(req.body.taskPlan).toString().replaceAll(',','');
     //   console.log("Create task for task "+taskplan)
        const taskdescription = Object.values(req.body.taskDescription).toString().replaceAll(',','');
        console.log("Task description "+taskdescription)
        const taskName = Object.values(req.body.taskName).toString().replaceAll(',','');
        console.log("Taskname "+taskName)
        var taskNotes=Object.values(req.body.taskNotes).toString().replaceAll(',','');
        // const taskcreator=Object.values(req.body.taskCreator).toString().replaceAll(',',''); 
        // console.log("Task creator "+taskcreator) 
        console.log("Task notes "+taskNotes)

        const bcrypt = require('bcrypt'); 

        const sql = "select username, password, active from "
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
              


               console.log("permit create "+hasAccess)

              
               if (respass!=true){
                console.log("Incorrect password")
               // res.sendStatus(403)
                res.status(401).json({"code":"401"})
                return
               }

               if (active!="Y"){
              //  console.log("User not active")
                res.status(401).json({"code":"401"})
             //   res.sendStatus(403)
                return
               }



              // 1. check group access

              var sqlAccess= "select app_permit_create as access from nodelogin.application where app_acronym ='"+app_acronym+"'"
              con.query(sqlAccess, function (err, result) {
              
               

                  console.log("Task id access for Create is : "+result[0].access)
                  groupnamesStr="'"+result[0].access.toString().replaceAll(" ","','")+"'"
                 
               //   groupnamesStr="'"+groupnamesStr.toString().replaceAll("'',", "")
               // split result into array
                 console.log("groupnamesStr "+groupnamesStr)

                 if (groupnamesStr!=""){
                  const sqlAccessMember = "select username as access from nodelogin.group_assign where groupname in ("+groupnamesStr+")"
                  console.log("Sql to check member is for access "+sqlAccessMember)
                  var userNames =""
                  con.query(sqlAccessMember, function (err, result) {
           
                 
                   if (err) throw err;
                   
                     console.log("Members in groups "+groupnamesStr +" query with "+sqlAccessMember)
                    
                     for ( var i=0; i<result.length; i++){
                       userNames = userNames+","+result[i].access
                       console.log("Username :"+result[i].access)
                                 
                     }
                     userNames=userNames+","
                     console.log("Usernames found in "+groupnamesStr+ " is "+userNames)
           

                     if (userNames.indexOf(username+",")==-1){
                      console.log("User not authorized")
                      res.status(403).json({"code":"403"})
                     
                      return
                     }  else {
                      try {

                        var sqlcheckduplicate = "select count(*) as exist from nodelogin.task where task_name = '"+taskName+"'"

                        con.query(sqlcheckduplicate, function (err, result) {

                          var exist = parseInt(result[0].exist)

                          if (exist!=0){
                            console.log("Taskname already exist")
                            res.status(405).json({"code":"405"})
                            return
                          } 


                 
                        if (taskNotes=="undefined"){
                          taskNotes="\n\n----------\nUser:"+username+", Current State: Create, Date and Time:"+Date()+"\n"
                        }  else {
                         
                          taskNotes = taskNotes+"\n\n----------\nUser:"+username+", Current State: Create, Date and Time:"+Date()+"\n"
                        }
        
                        var rnum=0
                        var sql_rnum = "select app_rnumber from nodelogin.application where app_acronym = '"+app_acronym+"'";
                        console.log("sql "+ sql_rnum)
                       
                        con.query(sql_rnum, function (err, result) {
                            if (err) throw err;
                            
                           rnum = parseInt(result[0].app_rnumber)
                    
                          console.log("current r_num " +rnum)
                    
                           var new_taskid = rnum
                       
                           new_taskid = app_acronym+"_"+new_taskid
                    
                         var sqlInsertTask = "insert into nodelogin.task "+
                         "(task_name, task_description, task_id, task_notes, task_app_acronym, task_state, task_creator, task_owner, task_createDate )"+
                         " values ('"+taskName+
                         "','"+taskdescription
                         +"','"+new_taskid
    
                         + "','"+taskNotes +"/n "
                         +"','"+app_acronym+
                         "','Open', '"
                         +""+username
                         +"',null,"
                         +"CURRENT_TIMESTAMP)"
                         console.log("Creating new task sql "+sqlInsertTask)
                    
                         rnum=rnum+1
                         var sql_updaternum = "update nodelogin.application set app_rnumber='"+rnum+"' where app_acronym = '"+app_acronym+"'";
                    
                         con.query(sql_updaternum, function (err, result) {
                          if (err) throw err;
                          console.log(result)
                          
                       })
                    
      
                         con.query(sqlInsertTask, function (err, result) {
                    
                          try { 
                            if (err) throw err;
                          //  res.send(result)
                       //   res.status(200).json({"message":"Task Id "+new_taskid+" created"})
                          res.status(200).json({"taskid":new_taskid, "code":"200"})
      
                       //   res.sendStatus(200)
                            return
      
                          } catch(err){
                            console.log(err)
                            res.status(500).json({"code":"500"}) 
                            return
                          }
                        
                           
                            });
                        
                         })
                        })
                      
                      
                        
                        } catch (err){
                        console.log("creating task - Error ")
                        console.log(err);
                        res.sendStatus(500).json({"code":"500"})
                        return
                      }
                      
                    
                     
                     }
                  })
                 }

     
     
                
               

                })
            
            //    res.send()
              });
              
              }
          
            // res.send();
         });
        
          
            }
      
  module.exports= 
  {
    createtask,
    createtask_app,
    apptaskid,
    getAllTasksByApp,
    getAllTasksByPlan,
    getTaskDetail,
    updateTask,
    updateTask_App,
    taskaccess,
    checktaskexist,
    promoteTask2Done,
    getTaskbyState
 
    }