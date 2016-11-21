angular.
  module("stockit").
  config(['$locationProvider', '$routeProvider', 
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/accounts', {
          template: '<account-list></account-list>'
        }).
        otherwise('/accounts');
    }
  ])
