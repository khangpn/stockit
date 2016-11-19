angular.
  module("stockit").
  config(['$locationProvider', '$routeProvider', 
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/customers', {
          template: '<customer-list></customer-list>'
        }).
        when('/customers/create', {
          template: '<customer-create></customer-create>'
        }).
        when('/customers/:customerId', {
          template: '<customer-detail></customer-detail>'
        }).
        when('/customers/:customerId/edit', {
          template: '<customer-edit></customer-edit>'
        }).
        otherwise('/customers');
    }
  ])
