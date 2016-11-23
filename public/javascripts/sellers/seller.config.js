angular.
  module("stockit").
  config(['$locationProvider', '$routeProvider', 
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/sellers', {
          template: '<seller-list></seller-list>'
        }).
        when('/sellers/create', {
          template: '<seller-create></seller-create>'
        }).
        when('/sellers/:sellerId', {
          template: '<seller-detail></seller-detail>'
        }).
        when('/sellers/:sellerId/edit', {
          template: '<seller-edit></seller-edit>'
        }).
        otherwise('/sellers');
    }
  ])
