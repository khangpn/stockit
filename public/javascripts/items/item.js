angular.module("item", ["ngRoute", 
"itemList", 
"itemDetail", 
"itemCreate", 
"core", 
"itemResource"]);

angular.module("stockit", ["item"]);
