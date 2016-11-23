angular.module("seller", ["ngRoute", 
"sellerList", 
"sellerCreate", 
"sellerDetail", 
"sellerEdit", 
"core", 
"sellerResource"]);

angular.module("stockit", ["seller"]);
