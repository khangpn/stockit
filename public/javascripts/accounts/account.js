angular.module("account", ["ngRoute", 
"accountList", 
"accountDetail", 
"accountCreate", 
"accountEdit", 
"core", 
"accountResource"]);

angular.module("stockit", ["account"]);
