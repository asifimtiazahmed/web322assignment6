/*********************************************************************************
* WEB322: Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Asif Imtiaz Ahmed Student ID: 138408174 Date: 01/29/2019
*
* Online (Heroku) URL:  https://glacial-plateau-86099.herokuapp.com/
*
********************************************************************************/ 
var dataService = require('./data-service'); //linking the data-service file for this module
var express = require('express'); //linking the express module here
var app = express(); //initializing
var HTTP_PORT = process.env.PORT || 8080; //defined the HTTP_PORT variable to use process.env.PORT to listen to available ports OR || listen to 8080
var path = require('path'); // we require this for using paths

app.use(express.static('public')); //using the express static function to put the public folder accessible for image, css resources. 

//Setting routes for root folder
app.get("/",function(request,response){                           //gets the request and sends the ressponse
    response.sendFile(path.join(__dirname+ '/views/home.html'));  //in this case sends the file
  
});
app.get("/about",function(request, response){
  response.sendFile(path.join(__dirname + '/views/about.html'));
});
app.get("/home",function(request, response){
  response.sendFile(path.join(__dirname + '/views/home.html'));
});

// Adding routes to the Employee, Manager and Departments
//Employees
app.get("/employees", function(request, response){
  dataService.getAllEmployees() //Here we dont use the { curly braces} because we are chaining functions, the .then operator goes into getAllEmployees and looks at the promise, and it take the resolve part of promise and serves up that data here. 
  .then(function(data){
    response.json(data);
  })
  .catch(function(data){    //this goes into the getAllEmployees and catches the reject part of the promise and serves that up/
    response.json({message:err})
  })

});
//Departments
app.get("/departments", function(request, response){
  dataService.getAllDepartments()
  .then(function(data){
    response.json(data);
  })
  .catch(function(data){
    response.json({message:err})
  });
});

//Managers
app.get("/managers", function(request, response){
  dataService.getManagers()
  .then(function(data){
    response.json(data);
  })
  .catch(function(data){
    response.json({message:err})
  });  
});

//Handle 404, This action needs to be at the end of the server file because otherwise it will catch other page requests.
app.use(function(req, res){
  res.status(400);
  res.sendFile(path.join(__dirname+ '/views/404.html'));
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