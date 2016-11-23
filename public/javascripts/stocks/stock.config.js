angular.
  module("stockit").
  config(['$locationProvider', '$routeProvider', 
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/stocks', {
          template: '<stock-list></stock-list>'
        }).
        when('/stocks/create', {
          template: '<stock-create></stock-create>'
        }).
        when('/stocks/:stockId', {
          template: '<stock-detail></stock-detail>'
        }).
        when('/stocks/:stockId/edit', {
          template: '<stock-edit></stock-edit>'
        }).
        otherwise('/stocks');
    }
  ])
