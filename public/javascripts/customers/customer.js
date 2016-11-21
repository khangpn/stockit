angular.module("customer", ["ngRoute", 
"customerList", 
"customerDetail", 
"customerCreate", 
"customerEdit", 
"customerPassword", 
"core", 
"customerResource"]);

angular.module("stockit", ["customer"]);
