angular.
  module("stockit").
  config(['$locationProvider', '$routeProvider', 
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/orders', {
          template: '<order-list></order-list>'
        }).
        when('/orders/create', {
          template: '<order-create></order-create>'
        }).
        when('/orders/:orderId', {
          template: '<order-detail></order-detail>'
        }).
        when('/orders/:orderId/edit', {
          template: '<order-edit></order-edit>'
        }).
        otherwise('/orders');
    }
  ])
