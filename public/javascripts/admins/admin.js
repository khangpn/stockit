angular.module("admin", ["ngRoute", 
"adminList", 
"adminDetail", 
"adminCreate", 
"adminEdit", 
"adminPassword", 
"core", 
"adminResource"]);

angular.module("stockit", ["admin"]);
