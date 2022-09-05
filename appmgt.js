
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
      try{
      if(err) throw err;
      console.log(rows[0].app_acronym)
      res.send(rows)

      } catch (err){
        console(err)
      }
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
  const sql_check_app = "select app_acronym, app_description, app_rnumber, app_startdate, app_enddate, app_permit_open, app_permit_todolist, app_permit_doing, app_permit_done, app_permit_create from nodelogin.application where app_acronym='"+app_acronym+"'";

  console.log("check app "+ sql_check_app);
  con.query(sql_check_app,
  function(err, rows){
    try{
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
      console.log("app permit_create "+ rows[0].app_permit_create);

     

     // app_startdate, app_enddate, app_permit_open, app_permit_todolist, app_permit_doing, app_permit_done from nodelogin.application where app_acronym='"+app_acronym+"'";
     res.send(rows)
    }catch (err){
      console.log("There is an error "+err)
      res.send("No result")
    }
  })
}


const checkaccess =(req, res)=>{
 
  var sql=""
 
    sql= "select username FROM nodelogin.group_assign WHERE groupname= 'AppLead'"

  con.query(sql, function (err, result) {
    if (err) throw err;
      try {
      
            console.log("size of result "+result.length)
            var length = parseInt(result.length)

            for (var i=0; i< length; i++){
              console.log("users : "+result[i].username)
            }
           
            res.send(result)
          } catch (err){

          }


        })
          


      

  }


const checkexistingapp =(req, res)=>{

  const app_acronym = req.body.app_acronym;


  const sql_check_app = "select count (lower(app_acronym)) as appcount from nodelogin.application where app_acronym= lower('"+app_acronym+"')"


  try {
    con.query(sql_check_app, function (err, result) {
     if (err) throw err;
     res.send(result)
     });
    } catch (err){
      console.log("checkExisting app - Error ")
      console.log(err);
    }

}
 


const updateapp = (req, res)=>{
  console.log("request - update app  " + req.body);
  const app_acronym = Object.values(req.body.app_acronym).toString().replaceAll(',','');
  var app_rnumber 
  var app_description
  var app_start_date
  var app_end_date

  const app_permit_open = Object.values(req.body.app_permit_open).toString().replaceAll(',','');
  const app_permit_todolist = Object.values(req.body.app_permit_todolist).toString().replaceAll(',','');
  
  const app_permit_doing = Object.values(req.body.app_permit_doing).toString().replaceAll(',','');
  const app_permit_done = Object.values(req.body.app_permit_done).toString().replaceAll(',','');
  const app_permit_create = Object.values(req.body.app_permit_create).toString().replaceAll(',','');

  
    app_rnumber = Object.values(req.body.app_rnumber).toString().replaceAll(',','');
 
 // app_rnumber = Object.values(req.body.app_rnumber).toString().replaceAll(',','');

  app_description = Object.values(req.body.app_description).toString().replaceAll(',','').replaceAll("'","^");

 
try {

  //app_start_date.split('T')[0]
  app_start_date = req.body.app_start_date;

 
 
} catch (err){
  console("Exception  in date "+err)
  app_start_date= null
} 


try {
  app_end_date = req.body.app_end_date;
  
} catch (err){
  console("Exception  in date "+err)
  app_end_date= null
} 



  console.log("app_acronym : " +app_acronym)
  console.log("app_rnumber : " +app_rnumber)
  console.log("app_description : " +app_description)
  console.log("app_start_date : " +app_start_date)
  console.log("app_end_date : " +app_end_date)

  var sql_app_update = "update nodelogin.application set app_rnumber='"+app_rnumber
  +"', app_description='"+app_description+
  "', app_startdate='"+app_start_date+
  "', app_enddate='"+app_end_date+
  "', app_permit_create ='"+app_permit_create+
  "', app_permit_open='"+app_permit_open+
  "', app_permit_todolist='"+app_permit_todolist+
  "', app_permit_doing='"+app_permit_doing+
  "', app_permit_done='"+app_permit_done+
  "' where app_acronym='"+app_acronym+"'";

  var gotstartdate = true
  var gotenddate = true

  if (app_start_date==''){
    console.log("no start date")
    gotstartdate=false
   }

  if (app_end_date==''){
   
    console.log("no end date")
    gotenddate=false

  } 
  

  if (app_start_date=='not set'){
    console.log("no start date")
    gotstartdate=false
   }

  if (app_end_date=='not set'){
   
    console.log("no end date")
    gotenddate=false

  } 
  
  if (!gotstartdate && !gotenddate){
    sql_app_update = "update nodelogin.application set app_rnumber='"+app_rnumber
    +"', app_description='"+app_description+
    
    "', app_permit_open='"+app_permit_open+
    "', app_permit_todolist='"+app_permit_todolist+
    "', app_permit_doing='"+app_permit_doing+
    "', app_permit_done='"+app_permit_done+
    "', app_permit_create='"+app_permit_create+
    "' where app_acronym='"+app_acronym+"'";
  }
else if (!gotstartdate){
     sql_app_update = "update nodelogin.application set app_rnumber='"+app_rnumber
    +"', app_description='"+app_description+
   
    "', app_enddate='"+app_end_date+
    "', app_permit_open='"+app_permit_open+
    "', app_permit_todolist='"+app_permit_todolist+
    "', app_permit_doing='"+app_permit_doing+
    "', app_permit_done='"+app_permit_done+
    "', app_permit_create='"+app_permit_create+
    "' where app_acronym='"+app_acronym+"'";
  } else if (!gotenddate){
    sql_app_update = "update nodelogin.application set app_rnumber='"+app_rnumber
    +"', app_description='"+app_description+
    "', app_startdate='"+app_start_date+
    
    "', app_permit_open='"+app_permit_open+
    "', app_permit_todolist='"+app_permit_todolist+
    "', app_permit_doing='"+app_permit_doing+
    "', app_permit_done='"+app_permit_done+
    "', app_permit_create='"+app_permit_create+
    "' where app_acronym='"+app_acronym+"'";
  
  }  
    
  
  console.log(sql_app_update)

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
  const app_acronym = req.body.app_acronym;
  const app_rnumber = req.body.app_rnumber;
  const app_description = req.body.app_description;
  // var app_start_date = Object.values(req.body.app_start_date).toString().replaceAll(',','');
  //var app_end_date = Object.values(req.body.app_start_date).toString().replaceAll(',','');
  

  const app_start_date = req.body.app_start_date
  const app_end_date = req.body.app_end_date
  const app_permit_open = req.body.app_permit_open
  const app_permit_todolist = req.body.app_permit_todolist
 // const app_permit_create = Object.values(req.body.app_permit_create).toString().replaceAll(',','');
  const app_permit_doing = req.body.app_permit_doing
  const app_permit_done = req.body.app_permit_done
  const app_permit_create = req.body.app_permit_create
 var sqlInsertApp =""





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
        res.send(rows)
      } 
      
      //else {




          console.log("app_acronym : " +app_acronym)
  console.log("app_rnumber : " +app_rnumber)
  console.log("app_description : " +app_description)
  console.log("app_start_date : " +app_start_date)
  console.log("app_end_date : " +app_end_date)

  console.log("app_permit_open : " +app_permit_open)
  console.log("app_permit_todolist : " +app_permit_todolist)
  console.log("app_permit_doing : " +app_permit_doing)
  console.log("app_permit_done : " +app_permit_done)
 
         console.log("Running no start date and end date")
          sqlInsertApp = "insert into nodelogin.application " +
          "( app_rnumber,"+
          " app_acronym,"+
            "app_description,"+
            "app_start_date,"+
            "app_end_date,"+

            "app_permit_open,"+
            "app_permit_todolist,"+
           "app_permit_doing,"+
           "app_permit_create,"+
           "app_permit_done) "+
           "values "+ 
           "('"+app_rnumber+"','" 
           +app_acronym+"','"
            +app_description+"','"
            +app_start_date+"','"
            +app_end_date+","
            +app_permit_open+"','"
            +app_permit_todolist+"','"
            +app_permit_doing+"','"
            +app_permit_create+"','"
            +app_permit_done+"')"

            
            console.log("app_acronym "+app_acronym)
            console.log("No start and end date ")
           
       const sqlInsertApp2 = `INSERT INTO nodelogin.application (app_acronym, app_description, App_Rnumber, App_startDate, App_endDate, App_permit_Open,App_permit_toDoList, App_permit_Doing, App_permit_Done, App_permit_create) VALUES ('${app_acronym}', '${app_description}', '${app_rnumber}','${app_start_date}', '${app_end_date}', '${app_permit_open}', '${app_permit_todolist}', '${app_permit_doing}', '${app_permit_done}', '${app_permit_create}');`
         
      
        // try {
          console.log("Running sql "+sqlInsertApp2)
        con.query(sqlInsertApp2, function (err, result) {
         if (err) throw err;
            res.send(result)
         });
        // } catch (err){
        //   console.log("checkExisting app - Error in inserting  nodelogin.accounts")
        //   console.log(err);
        //   res.send(err)
        // }

    //  }
     
    
  })
}




  module.exports= 
  {
    checkexistingapp,
    createapp,
    checkapp,
    listapp,
    updateapp,
    checkaccess,
    }