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



const counttask = (req, res)=>{
    const app_acronym = Object.values(req.body.app_acronym).toString().replaceAll(',','');
    console.log("Create task for app "+app_acronym)

    var sqlCountTaskApp = "select count(*) as taskcount from nodelogin.task where task_id like '"+app_acronym+"%'";

  try {
   
    con.query(sqlCountTaskApp, function (err, result) {
        if (err) throw err;
        taskcount=result[0].taskcount 
        console.log("Current task count in "+app_acronym+" is "+taskcount)
        res.send(result)
        
     }); 
    } catch (err){
        console.log("check task count")
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



const groupaccess = (req, res)=>{


  var access_type = req.body.access_type.toString()
  console.log("access_type "+access_type)
  var app_acronym = req.body.app_acronym.toString()
  console.log("app_acronym "+app_acronym)
  // create query for application table

  var sqlAccess = ""

  // Step 1 get group permit access in open/todo/doing/Done from appliaction table
  if (access_type == "Open"){
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
 

    con.query(sqlAccess, function (err, result) {
        if (err) throw err;
        
          console.log("Task id access for"+access_type+" is : "+result[0].access)
         
          groupnamesStr="'"+result[0].access.toString().replaceAll(" ","','")+"'"
          groupnamesStr=groupnamesStr.substring(3,groupnamesStr.length)
       //   groupnamesStr="'"+groupnamesStr.toString().replaceAll("'',", "")
       // split result into array
         console.log("groupnamesStr "+groupnamesStr)

       
    
       /////////////////NAR BEI ANOTHER NESTED SQL
      // Step 2 get groupmembers in these groups 
       const sqlAccessMember = "select username as access from nodelogin.group_assign where groupname in ("+groupnamesStr+")"

       con.query(sqlAccessMember, function (err, result) {
        if (err) throw err;
        
          console.log("Members in groups "+groupnamesStr +" query with "+sqlAccessMember)
         
          for ( var i=0; i<result.length; i++){
            console.log("Username :"+result[i].access)
                      
          }
          res.send(result)
       })
      
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


  var sqlUpdateTask = "update nodelogin.task "
  + "set task_name='"+taskName
  +"', task_description ='"+taskdescription

  +"', task_state = '"+taskstate
  +"', task_notes = '"+taskNotes
  +"', task_owner = '"+taskOwner
  +"' where task_id ='"+taskId+"'"


  try {
    con.query(sqlUpdateTask, function (err, result) {
        if (err) throw err;
       
        console.log("Run update task  "+sqlUpdateTask)
       });
    }
 catch (err){
    console.log("Update task - Error updating app task")
    console.log(err);
  }

}


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
  const taskNotes=Object.values(req.body.taskNotes).toString().replaceAll(',',''); 
  console.log("Task notes "+taskNotes)
  const taskcreator=Object.values(req.body.taskCreator).toString().replaceAll(',',''); 
  console.log("Task creator "+taskcreator)

  // get current count of task for app
  var sqlCountTaskApp = "select count(*) as taskcount from nodelogin.task where task_id like '"+app_acronym+"%'";

  var taskcount = 0
    
    try {
    con.query(sqlCountTaskApp, function (err, result) {
        if (err) throw err;
        taskcount=parseInt (result[0].taskcount)  
        console.log("Current task count in "+app_acronym+" is "+taskcount)
        
        taskcount = taskcount+1
    console.log("New task count in "+app_acronym+" is "+taskcount)
     var task_id = ""+app_acronym+"_"+taskcount.toString()
     console.log("new task count in string "+taskcount.toString())
     console.log("Create new task id for task "+ task_id)
     var sqlInsertTask = "insert into nodelogin.task "+
     "(task_name, task_description, task_id, task_notes, task_app_acronym, task_state, task_creator, task_owner, task_createDate )"+
     " values ('"+taskName+
     "','"+taskdescription
     +"','"+task_id
     
     + "','"+taskNotes
     +"','"+app_acronym+
     "','Open', '"
     +taskcreator
     +"',null,"
     +"CURRENT_TIMESTAMP)"
     console.log("Creating new task sql "+sqlInsertTask)

     con.query(sqlInsertTask, function (err, result) {
        if (err) throw err;

        });

        
     });
    }
 catch (err){
    console.log("checkExisting app - Error checking app count")
    console.log(err);
  }
    
      }
     
      
  module.exports= 
  {
   
    createtask,
    counttask,
    getAllTasksByApp,
    getTaskDetail,
    updateTask,
    groupaccess
 
    }