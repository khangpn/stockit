angular.module("customer", ["ngRoute", 
"customerList", 
"customerDetail", 
"customerCreate", 
"customerEdit", 
"core", 
"customerResource"]);

angular.module("stockit", ["customer"]);
