var mysql = require('mysql');

var nodemailer = require('nodemailer')

var transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {

    user: 'chernhaw21@outlook.sg',
    pass: 'PsalmOne00'

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
  const task_id = Object.values(req.body.task_id).toString().replaceAll(',','');
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
  const app_acronym = Object.values(req.body.app_acronym).toString().replaceAll(',','');
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
 
  
 
const updateTask = (req, res)=>{

  console.log("Update task ")
  const app_acronym = Object.values(req.body.app_acronym).toString().replaceAll(',','');
  console.log("task for app "+app_acronym)
  const taskplan = Object.values(req.body.taskPlan).toString().replaceAll(',','');
  console.log("Create task for task "+taskplan)
  
  const taskName = Object.values(req.body.taskName).toString().replaceAll(',','');
  console.log("Taskname "+taskName)

  const taskdescription = Object.values(req.body.taskDescription).toString().replaceAll(',','');
  console.log("Task description "+taskdescription)

  const taskstate=Object.values(req.body.taskState).toString().replaceAll(',',''); 
  console.log("Task state "+taskstate)
  
  const taskNotes=Object.values(req.body.taskNotes).toString().replaceAll(',',''); 
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
            from: 'chernhaw21@outlook.sg',
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


const createtask = (req, res)=>{
  console.log("request - create new task " + req.body);

  const app_acronym = Object.values(req.body.app_acronym).toString().replaceAll(',','');
  console.log("Create task for app "+app_acronym)
  const taskplan = Object.values(req.body.taskPlan).toString().replaceAll(',','');
  console.log("Create task for task "+taskplan)
  const taskdescription = Object.values(req.body.taskDescription).toString().replaceAll(',','');
  console.log("Task description "+taskdescription)
  const taskName = Object.values(req.body.taskName).toString().replaceAll(',','');
  console.log("Taskname "+taskName)
  var taskNotes=Object.values(req.body.taskNotes).toString().replaceAll(',',''); 
  console.log("Task notes "+taskNotes)
  if (taskNotes=="undefined"){
    taskNotes=""
  }
  const taskcreator=Object.values(req.body.taskCreator).toString().replaceAll(',',''); 
  console.log("Task creator "+taskcreator)

  // get current count of task for app

  var last_taskid=0
  var new_taskid=0
  var rnum=0

  // set default task_id first
  // 1 get rnumber from application

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


     con.query(sqlInsertTask, function (err, result) {
        if (err) throw err;
        console.log(result)
        res.send(result)
        });
     })


     rnum=rnum+1
     var sql_updaternum = "update to nodelogin.applications set rnum='"+rnum+"' where app_acronym = '"+app_acronym+"'";

     con.query(sql_updaternum, function (err, result) {
      if (err) throw err;
      console.log(result)
        res.send(result)
   })

    //  var sqlTask = "select task_id from nodelogin.task where task_id ='"+new_taskid+"'"

    //  con.query(sqlTask, function (err, result1) {
    //   if (err) throw err;

    //   console.log("Result "+result1)

    //   res.send("Result "+result1)
    //   });
   
   
     

  
    
    } catch (err){
    console.log("creating task - Error ")
    console.log(err);
  }
    
      }
    
      
  module.exports= 
  {
   
    createtask,
    apptaskid,
    getAllTasksByApp,
    getAllTasksByPlan,
    getTaskDetail,
    updateTask,
    taskaccess
 
    }