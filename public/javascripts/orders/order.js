angular.module("order", ["ngRoute", 
"orderList", 
"orderDetail", 
"orderCreate", 
"orderEdit", 
"core", 
"orderResource"]);

angular.module("stockit", ["order"]);
