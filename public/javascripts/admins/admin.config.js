angular.
  module("stockit").
  config(['$locationProvider', '$routeProvider', 
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/admins', {
          template: '<admin-list></admin-list>'
        }).
        when('/admins/create', {
          template: '<admin-create></admin-create>'
        }).
        when('/admins/:adminId', {
          template: '<admin-detail></admin-detail>'
        }).
        when('/admins/:adminId/edit', {
          template: '<admin-edit></admin-edit>'
        }).
        when('/admins/:adminId/password/update', {
          template: '<admin-password></admin-password>'
        }).
        otherwise('/admins');
    }
  ])
