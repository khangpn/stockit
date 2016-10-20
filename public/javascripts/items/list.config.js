angular.
  module("stockit").
  config(['$locationProvider', '$routeProvider', //this is if we minify
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/items', {
          template: '<item-list></item-list>'
        }).
        when('/items/:itemId', {
          template: '<item-detail></item-detail>'
        }).
        otherwise('/items');
    }
  ])
