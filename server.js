/*********************************************************************************
* WEB322: Assignment 5
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Asif Imtiaz Ahmed Student ID: 138408174 Date: 03/16/2019
*
* Online (Heroku) URL:  
* 
*  https://glacial-plateau-86099.herokuapp.com/ 
********************************************************************************/ 
var dataService = require('./data-service'); //linking the data-service file for this module
var express = require('express'); //linking the express module here
var exphbs = require('express-handlebars');
var multer = require('multer'); //forreceiving images an stiring them
const bodyParser = require ('body-parser');
var app = express(); //initializing
var HTTP_PORT = process.env.PORT || 8080; //defined the HTTP_PORT variable to use process.env.PORT to listen to available ports OR || listen to 8080
var path = require('path'); // we require this for using paths
app.use(express.static('public')); //using the express static function to put the public folder accessible for image, css resources. 
const fs = require('fs');
app.use(bodyParser());

app.use(bodyParser.urlencoded({ extended:true })); //for parsing data sent via url from browser
// directly from the week 6 lessoon. Telling the server to see any file with extension hbs to use the handlebars to view the page./render the page
app.engine('.hbs', exphbs({ 
  extname: '.hbs',
  defaultLayout: 'main',
  helpers: {
    //helper for Nav
    navLink: function(url, options){
    return '<li' +
    ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
    '><a href="' + url + '">' + options.fn(this) + '</a></li>';
    },
    //additional helped
    equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3)
      throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
      return options.inverse(this);
      } else {
      return options.fn(this);
        }
      }  
  } 
}));

app.set('view engine', '.hbs');
// Initializing multer storage engine
const storage = multer.diskStorage({
  destination: './public/images/uploaded',
  filename: function (req, file, cb) {
    // we write the filename as the current date down to the millisecond
    // in a large web service this would possibly cause a problem if two people
    // uploaded an image at the exact same time. A better way would be to use GUID's for filenames.
    // this is a  simple example.
    //null -> we dont want err reporting,
    //
    cb(null, file.fieldname + '-'+ Date.now() + path.extname(file.originalname));
  }
});


// tell multer to use the diskStorage function for naming files instead of the default.
//initialize the upload variable
const upload = multer({ storage: storage }).single('imageFile');

app.use(function(req,res,next){  //for the nav bar
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
  next();
  });

  

  

//Setting routes for root folder
app.get("/",function(request,response){                           //gets the request and sends the ressponse
    //response.sendFile(path.join(__dirname+ '/views/home.html'));  ////in this case sends the file
    response.render('home');
  
});
app.get("/about",function(request, response){
 // response.sendFile(path.join(__dirname + '/views/about.html'));
 response.render('about');
});
app.get("/home",function(request, response){
  //response.sendFile(path.join(__dirname + '/views/home.html'));
  response.render('home');
});
app.get("/employees/add",function(request, response){
  //response.sendFile(path.join(__dirname + '/views/addEmployee.html'))
  response.render('addEmployee');
});
app.post("/employees/add",function(request,response){
dataService.addEmployee(request.body);
response.redirect('/employees');
});
app.get("/images/add", function(request, response){
//  response.sendFile(path.join(__dirname+ '/views/addImage.html'))
response.render('addImage');
});

app.post("/images/add", (req, res) => {
  upload(req,res,(err) => {
    if(err){
      res.render('/images/add',{ 
      msg: err});
    } else {
  //  console.log(req.file);
   res.redirect('/images');  //redirecting to the get request of /images that was setup above
    }
  });
});
app.get("/images", function(request, response){
  
  //Creating the JSON file for showing how many files are in the image folder
  var imgPath = "./public/images/uploaded";
  fs.readdir(imgPath, function(err, items){ 
 response.render('images', {images: items,
  stats: "/images/uploaded/"
})// response.json({images:items}) got the previous code as redundant, now it will send the images hbs file the images array object.
  
});
 
});

app.post("/employee/update", (req, res) => {
  dataService.updateEmployee(req.body);
  res.redirect("/employees");
  }); 

// Adding routes to the Employee, Manager and Departments
// Including Query Strings

//Employees
app.get("/employees", function(request, response){
 // console.log(request.query)
  if (request.query.status){ //if this is true
    dataService.getEmployeesByStatus(request.query.status)//passing in the value from the query
    .then(function(dataFromPromiseResolve){
      response.render('employees', {employees: dataFromPromiseResolve});
    })
    .catch(function(dataFromPromiseResolve){
      response.render('employees',{message: "no results"});
    });

  } else if (request.query.department){
    console.log("department Selected"+request.query.department);
    dataService.getEmployeesByDepartment(request.query.department)
    .then(function(dataFromPromiseResolve){
      response.render('employees', {employees: dataFromPromiseResolve});
    })
    .catch(function(dataFromPromiseResolve){
      response.render('employees',{message: "no results"});
    });

  } else if (request.query.manager){
    dataService.getEmployeesByManager(request.query.manager)
    .then(function(dataFromPromiseResolve){
      response.render('employees', {employees: dataFromPromiseResolve});
    })
    .catch(function(dataFromPromiseResolve){
      response.render('employees',{message: "no results"});
    });

    } else {
  
        dataService.getAllEmployees() //Here we dont use the {  curly braces} because we are chaining functions, the .then operator goes into getAllEmployees and looks at the promise, and it take the resolve part of promise and serves up that data here. 
        .then(function(data){
          response.render('employees', {employees: data});;
      
      })
        .catch(function(data){    //this goes into the getAllEmployees and catches the reject part of the promise and serves that up/
          response.render('employees',{message: "no results"});
      })
      
    }
});
//Special employee/value get request
app.get('/employee/:value', function(request, response){
 // console.log("This is a new one " + request.params.value);
  dataService.getEmployeeByNum(request.params.value) //sending the value to dataService
  .then(function(dataFromPromiseResolve){
    response.render('employee', {employee: dataFromPromiseResolve})
  })
  .catch(function(dataFromPromiseResolve){
    response.render('employee',{message: "no results"});
  });
});


//Departments
app.get("/departments", function(request, response){
  dataService.getAllDepartments()
  .then(function(dataFromPromiseResolve){
    response.render('departments', {departments: dataFromPromiseResolve});
  })
  .catch(function(dataFromPromiseResolve){
    response.render('departments',{message: "no results"});
  });
});

//Managers
// app.get("/managers", function(request, response){
//   dataService.getManagers()
//   .then(function(data){
//     response.json(data);
//   })
//   .catch(function(data){
//     response.json({message:err})
//   });  
// });

//Handle 404, This action needs to be at the end of the server file because otherwise it will catch other page requests.
app.use(function(req, res){
  res.status(400);
  res.render('404');
  
});

function onHttpStart()
  {
  console.log('Express http server listening on: '+HTTP_PORT);
  }

dataService.initialize()
.then(function()
{// setup http server to listen on HTTP_PORT
  app.listen(HTTP_PORT, onHttpStart)
})
.catch(function()
{
console.log("Some errors were found reading JSON files on data-server.js");
});