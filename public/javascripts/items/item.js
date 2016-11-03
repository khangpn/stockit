angular.module("item", ["ngRoute", 
"itemList", 
"itemDetail", 
"itemCreate", 
"itemEdit", 
"core", 
"itemResource"]);

angular.module("stockit", ["item"]);
