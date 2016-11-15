angular.
  module("stockit").
  config(['$locationProvider', '$routeProvider', 
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/accounts', {
          template: '<account-list></account-list>'
        }).
        when('/accounts/create', {
          template: '<account-create></account-create>'
        }).
        when('/accounts/:accountId', {
          template: '<account-detail></account-detail>'
        }).
        when('/accounts/:accountId/edit', {
          template: '<account-edit></account-edit>'
        }).
        otherwise('/accounts');
    }
  ])
