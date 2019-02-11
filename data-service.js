const fs = require('fs');
var employees =[];
var departments = [];
var managers = [];
var employeeToAdd = []; //asgn_3

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

function addEmployee(empData)
{
  return new Promise(function(resolve, reject)
  {
    if (employees.length==0)
    {
    reject("unable to read employee data");
    } else{
      if (empData.isManager='undefined'){
        empData.isManager='false';
      } else {
        empData.isManager='true';
      }
      empData.employeeNum=(employees.length)+1;
      employees.push(empData);
      resolve(employees);
    }
  });
}
module.exports.addEmployee = addEmployee;

function getEmployeesByStatus(status){

  return new Promise(function(resolve, reject)
  {
    if (employees.length==0)
    {
      reject("0 Results Returned");
    } else{
      var empStatus=[];
        for(var i=0; i<employees.length;i++){
          if(employees[i].status==status){
            empStatus.push(employees[i]);
          }
        }
        resolve(empStatus);
      } 
  });
}
module.exports.getEmployeesByStatus = getEmployeesByStatus;

function getEmployeesByDepartment(department){
return new Promise(function(resolve, reject)
{
  if (departments.length==0)
  {
    reject("Cannot read department Data");
  } else {
    var deptEmp=[];
    for (var i=0; i<employees.length;i++){
      if(employees[i].department == department){
        deptEmp.push(employees[i]);
      }
    }
    resolve(deptEmp);
  }
});
}

module.exports.getEmployeesByDepartment = getEmployeesByDepartment;

function getEmployeesByManager(manager){

  return new Promise(function(resolve, reject)
  {
    if (employees.length==0){
      reject("Cannot read Employee Data");
    } else {
      var empManaged=[];
      for(var i = 0; i<employees.length;i++){
        if(employees[i].employeeManagerNum == manager){
          empManaged.push(employees[i]);
        }
      }
      resolve(empManaged);
    }
  });
}
module.exports.getEmployeesByManager = getEmployeesByManager;

function getEmployeeByNum(num){
return new Promise(function(resolve, reject)
{
  if (employees.length==0){
    reject("Cannot read Employee Data");
  } else {
    var emploData =[];
    for (var i=0; i<employees.length; i++){
      if(employees[i].employeeNum == num){
        emploData.push(employees[i]);
      }
    } 
    resolve(emploData);
  }
});
}
module.exports.getEmployeeByNum = getEmployeeByNum;
