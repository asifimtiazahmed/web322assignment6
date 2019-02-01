/*********************************************************************************
* WEB322: Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Asif Imtiaz Ahmed Student ID: 138408174 Date: 01/29/2019
*
* Online (Heroku) URL: 
*
********************************************************************************/ 
var dataService = require('./data-service');
var express = require('express');
var app = express();
var HTTP_PORT = process.env.PORT || 8080;
var path = require('path');
app.use(express.static('static'));
app.use(express.static('public'));

//Resources
      //send img resource for the 404 file
      app.get("/views/404-page-04.png", function(req, res){
        res.sendFile(path.join(__dirname+'/views/404-page-04.png'));
      });
    

app.get("/",function(request,response){
    response.sendFile(path.join(__dirname+ '/views/home.html'));
  
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
  dataService.getAllEmployees()
  .then(function(data){
    response.json(data);
  })
  .catch(function(data){
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