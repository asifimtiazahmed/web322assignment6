const Sequelize = require('sequelize');

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
const Employees = sequelize.define("Employees", {
  employeeNum: {
    type: Sequelize.INTEGER,
  primaryKey: true,
  autoIncrement: true},
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  SSN: Sequelize.STRING,
  addressStreet: Sequelize.STRING,
  addressCity: Sequelize.STRING,
  addressState: Sequelize.STRING,
  addressPostal: Sequelize.STRING,
  maritalStatus: Sequelize.STRING,
  isManager: Sequelize.BOOLEAN,
  employeeManagerNum: Sequelize.INTEGER,
  status: Sequelize.STRING,
  department: Sequelize.INTEGER,
  hireDate: Sequelize.STRING,
});
// Defining model "Department"
const Departments = sequelize.define("Departments", {
  departmentId: {
  type: Sequelize.INTEGER,
  primaryKey: true,
  autoIncrement: true},
  departmentName: Sequelize.STRING,
});

function initialize()
{
  sequelize.sync()
  return new Promise(function (resolve, reject) {
    resolve("complete resolve");
    reject("rejected");
   });
}

module.exports.initialize = initialize;

function getManagers(){
  return new Promise(function (resolve, reject){
    var isMgr=[];
    Employees.findAll()
    .then(function(empData){
      for(var i=0;i<empData.length;i++){
        if(empData[i].isManager)
          isMgr.push(empData[i])
      }
      resolve(isMrg);
    })
    reject("Sorry no results returned from Server.")

  });
}


module.exports.getManagers = getManagers;

function getAllEmployees()
{
  return new Promise(function (resolve, reject) {

  Employees.findAll().then(function(data){
   // console.log("All employees");
    //for (var i =0; i<data.length; i++){
      //console.log(data[i].dataValues.firstName);
    //}
    //console.log(data);
    //console.log(data);
    resolve(data);
    if (data.length == 0){
    reject("Sorry, No Records Could Be Found");
    }
  });
   });
}

module.exports.getAllEmployees = getAllEmployees;

function getAllDepartments()
{
  return new Promise(function (resolve, reject) {
    Departments.findAll()
    .then(function(deptData){
      resolve(deptData);

    })
    reject("Sorry, No entries found");
   });
}
module.exports.getAllDepartments = getAllDepartments;

function addEmployee(empData){
  return new Promise(function (resolve, reject) {
    if(empData.isManager){
      empData.isManager = true;
      console.log("true");
    } else{
      empData.isManager = false;
      console.log("false");
    }
    for(const prop in empData){ //for in loop to iterate through the objects property looking for a "" space and then replacing it with a  null value.
      if(empData[prop]=="" || empData[prop]== " ")
        empData[prop]=null;
    }
    //I need to read the whole employee database to know the next ID for employee
    
    Employees.create({
    // employeeNum: empData.length+1, //It should auto increment
      firstName: empData.firstName,
      lastName: empData.lastName,
      email: empData.email,
      SSN: empData.SSN,
      addressStreet: empData.addressStreet,
      addressCity: empData.addressCity,
      addressState: empData.addressState,
      addressPostal: empData.addressPostal,
      maritalStatus: empData.maritalStatus,
      isManager: empData.isManager,
      employeeManagerNum: empData.employeeManagerNum,
      status: empData.status,
      department: empData.department,
      hireDate: empData.hireDate
    }).then(function(){console.log("Employee Created")})
    .catch(function(err){
    console.log(err, request.body);
    resolve({message: "Employee Created Successfully"});
    reject({message: "Unable to create Employee"});
    });
   });
}
module.exports.addEmployee = addEmployee;

function getEmployeesByStatus(status){
  var array=[];
  return new Promise(function (resolve, reject) {
    Employees.findAll()
    .then(function(employeeData){
      for (var i = 0; i < employeeData.length; i++){
      if (employeeData[i].status == status)
      array.push(employeeData[i])
    }
    resolve(array)
    reject("No " + status + " status Found in the Database");  
    }); 
   });
}
module.exports.getEmployeesByStatus = getEmployeesByStatus;

function getEmployeesByDepartment(department){
  let tempEmpByDept=[];
  return new Promise(function (resolve, reject) {
  Employees.findAll()
    .then(function(dataEmp){
      for (var i=0;i<dataEmp.length;i++){
        if(dataEmp[i].department == department)
        tempEmpByDept.push(dataEmp[i]);
      }
    resolve(tempEmpByDept);
    reject("Sorry, Could Not Find Employee in the Department number " + department);
    });
   });
}

module.exports.getEmployeesByDepartment = getEmployeesByDepartment;

function getEmployeesByManager(manager){
  let tempManager=[];
  return new Promise(function (resolve, reject) {
  Employees.findAll()
    .then(function(dataEmp){
      for (var i=0;i<dataEmp.length;i++){
        if(dataEmp[i].employeeManagerNum == manager)
        tempManager.push(dataEmp[i]);
      }
    resolve(tempManager);
    reject("Sorry, Could Not Find Managers of number " + manager);
    });
   });
}
module.exports.getEmployeesByManager = getEmployeesByManager;

function getEmployeeByNum(num){
  let tempEmpByNum=[];
  return new Promise(function (resolve, reject) {
  Employees.findAll()
    .then(function(dataEmp){
      for (var i=0;i<dataEmp.length;i++){
        if(dataEmp[i].employeeNum == num)
        tempEmpByNum.push(dataEmp[i]);
      }
    resolve(tempEmpByNum);
    reject("Sorry, Could Not Find Employee of number " + num);
    });
   });
}
module.exports.getEmployeeByNum = getEmployeeByNum;

function updateEmployee(empData){
  return new Promise(function (resolve, reject) {
    empData.isManager = (empData.isManager)? true:false;
    for(const prop in empData){
      if(empData[prop]=="")
        empData[prop]=null;
    }
    Employees.update({
     firstName: empData.firstName,
     lastName: empData.lastName,
     email: empData.email,
     SSN: empData.SSN,
     addressStreet: empData.addressStreet,
     addressCity: empData.addressCity,
     addressState: empData.addressState,
     addressPostal: empData.addressPostal,
     maritalStatus: empData.maritalStatus,
     isManager: empData.isManager,
     employeeManagerNum: empData.employeeManagerNum,
     status: empData.status,
     department: empData.department,
     hireDate: empData.hireDate
   },{
     where: {employeeNum: empData.employeeNum}
   }).then(function(){
console.log("Updated");
   });
    
    resolve();
    reject();
   });
}
module.exports.updateEmployee = updateEmployee;

function getDepartmentById(id){
  let tempDeptNum=[];
  return new Promise(function (resolve, reject) {
  Departments.findAll()
    .then(function(dataDept){
      for (var i=0;i<dataDept.length;i++){
        if(dataDept[i].departmentId == id)
        tempDeptNum.push(dataDept[i]);
      }
    resolve(tempEmpByNum[0]);
    reject("Sorry, Could Not Find Department of ID " + id);
    });
   });
}
module.exports.getDepartmentById = getDepartmentById;

function addDepartment(departmentData){
return new Promise(function(resolve, reject){
if(departmentData.departmentId=="")
  departmentData.departmentId=null;
if(departmentData.departmentName=="")
departmentData.departmentName=null;
Departments.create({
  departmentName: departmentData.departmentName
}).then(function(){console.log("New Dept Created")})
.catch(function(err){console.log(err)})
resolve({message: "Successfully Created New Dept"});
reject({message: "Department Could not be Created"})
});
}
module.exports.addDepartment = addDepartment;

function updateDepartment(departmentData){
  if(departmentData.departmentId=="")
  departmentData.departmentId=null;
if(departmentData.departmentName=="")
departmentData.departmentName=null;
  return new Promise(function (resolve, reject){
    Departments.update({
      departmentName: departmentData
    }, {
      where: {departmentId: departmentData.departmentId}
    });
    resolve({message: "Department updated"});
    reject({message: "Department data could not be updated"});
  })
}
module.exports.updateDepartment = updateDepartment;