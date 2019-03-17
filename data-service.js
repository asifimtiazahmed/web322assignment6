const Sequelize = require('sequelize');
const fs = require('fs');
var employees =[];
var departments = [];
var managers = [];
var employeeToAdd = []; //asgn_3

var sequelize = new Sequelize('de9fcken8a8867', 'xwfuygaaaczsqo', 'e577643532f9ea5b58ac78253cac18517e40a594356e113f28e0c3e5ad363344', {
  host: 'ec2-54-221-201-212.compute-1.amazonaws.com',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
  ssl: true
  }
 });
// Authenticate string, this will be moved to server.js
 sequelize
    .authenticate()
    .then(function() {
        console.log('Connection has been established successfully.');
    })
    .catch(function(err) {
        console.log('Unable to connect to the database:', err);
    });
// Defining model "Employee"
const Employee = sequelize.define("Employee", {

})

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

function updateEmployee(employeeData){
  return new Promise(function(resolve, reject){
    if (employeeData.length==0){
      reject("No data passed through");
    } else {
      for (var i =0; i<employees.length; i++){
        if(employees[i].employeeNum==employeeData.employeeNum){
          employees[i].firstName =employeeData.firstName,
          employees[i].lastName = employeeData.lastName,
          employees[i].email= employeeData.email,
          employees[i].SSN = employeeData.SSN,
          employees[i].addressStreet =employeeData.addressStreet,
          employees[i].addressCity = employeeData.addressCity,
          employees[i].addressState= employeeData.addressState,
          employees[i].addressPostal= employeeData.addressPsoral,
          employees[i].maritalStatus = employeeData.maritalStatus,
          employees[i].isManager= employeeData.isManager,
          employees[i].employeeManagerNum = employeeData.employee,
          employees[i].status = employeeData.status,
          employees[i].department= employeeData.department,
          employees[i].hireDate= employeeData.hireDate
        }
      }
      resolve();
    }
  });
}
module.exports.updateEmployee = updateEmployee;