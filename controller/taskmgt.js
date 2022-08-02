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
  


const updateplan = (req, res)=>{
  console.log("request - update app  " + req.body);
  const plan_app_acronym = Object.values(req.body.plan_app_acronym).toString().replaceAll(',','');
  
  const plan_start_date = Object.values(req.body.plan_start_date).toString().replaceAll(',','');
  const plan_end_date = Object.values(req.body.plan_end_date).toString().replaceAll(',','');


  console.log("plan_app_acronym : " +plan_app_acronym)
 
  console.log("plan_start_date : " +plan_start_date)
  console.log("plan_end_date : " +plan_end_date)
 

  const sql_plan_update = "update nodelogin.plan set plan_startdate='"+plan_start_date+"', plan_enddate='"+plan_end_date+"' where plan_app_acronym='"+plan_app_acronym+"'";

  try {
    con.query(sql_plan_update, function (err, result) {
     if (err) throw err;
     res.send(result)
     });
    } catch (err){
      console.log("error in updating plan -")
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
    counttask
   
    }