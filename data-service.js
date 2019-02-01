const fs = require('fs');
var employees =[];
var departments = [];
var managers = [];

function initialize()
{
  fs.readFile('./data/employees.json',function(err,data)
  {
    if(err)
    {
      throw err;
    }
      employees = JSON.parse(data);

  });

  fs.readFile('./data/departments.json',function(err,data)
  {
    if(err)
    {
      throw err;
    }
    departments = JSON.parse(data);
  });

  return new Promise(function(resolve,reject){
    resolve("success");
    reject("unable to read file");
  });
}

module.exports.initialize = initialize;

function getManagers(){
  var temp=[];
  return new Promise(function(resolve, reject)
  {
    if (employees.length==0)
    {
    reject("unable to read employee data");
    } else{
      for (var i=0; i<employees.length;i++)
      {
        if(employees[i].isManager===true)
        {
        temp.push(employees[i]);
        }
      }
      resolve(temp);
    }
  });
}
module.exports.getManagers = getManagers;

function getAllEmployees()
{
  return new Promise(function(resolve,reject)
  {
    if (employees.length==0)
    {
      reject("no Data found in employees")
    }

    resolve(employees); 
  });
}

module.exports.getAllEmployees = getAllEmployees;

function getAllDepartments()
{
  return new Promise(function(resolve,reject)
  {
    if (departments.length==0)
    {
      reject("no Data found in departments")
    }

    resolve(departments); 
  });
}
module.exports.getAllDepartments = getAllDepartments;