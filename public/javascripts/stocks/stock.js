angular.module("stock", ["ngRoute", 
"stockList", 
"stockDetail", 
"stockCreate", 
"stockEdit", 
"core", 
"stockResource"]);

angular.module("stockit", ["stock"]);
