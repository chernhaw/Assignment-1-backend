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

const createplan = (req, res)=>{
  console.log("request - create new app " + req.body);
  const app_acronym = Object.values(req.body.app_acronym).toString().replaceAll(',','');
  const plan_mvp_name = Object.values(req.body.plan_mvp_name).toString().replaceAll(',','');
 
  var plan_start_date = null
  var plan_end_date = null
  try {
    plan_start_date = Object.values(req.body.plan_start_date).toString().replaceAll(',','');
  } catch (e){
    plan_start_date= null
  } 
  
  try {
    plan_end_date = Object.values(req.body.plan_end_date).toString().replaceAll(',','');
  } catch (e){
    plan_end_date= null
  } 
 
 const plan_app_acronym=""+plan_mvp_name+app_acronym+""

  console.log("app_acronym : " +app_acronym)
 
  console.log("plan_mvp_name : " +plan_mvp_name)
  console.log("plan_start_date : " +plan_start_date)
  console.log("plan_end_date : " +plan_end_date)


  console.log("plan_app_acronym : " +plan_app_acronym)
 

  
        var sqlInsertPlan = "insert into nodelogin.plan "+
        "(plan_mvp_name, plan_startdate, plan_enddate, plan_app_acronym )"+
        " values ('"+plan_mvp_name+"','"+plan_start_date+"','"+plan_end_date+"','"+plan_app_acronym+"')"
        console.log(sqlInsertPlan)

        try {
        con.query(sqlInsertPlan, function (err, result) {
         if (err) throw err;

         });
        } catch (err){
          console.log("checkExisting app - Error in inserting  nodelogin.accounts")
          console.log(err);
        }
     //   res.send(res)
      }
     
      
  module.exports= 
  {
   
    createplan,
    checkplan,
    listplans,
    updateplan,
    retrieveplan,

    }