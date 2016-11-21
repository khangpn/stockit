angular.
  module('adminCreate').
  component('adminCreate', { 
    templateUrl: '/admins/partials/create',
    controller: ['$routeParams', '$location', 'Admin',
      function AdminCreateController($routeParams, $location, Admin) {
        var self = this;
        this.save = function(admin) {
          var i = new Admin(admin);
          i.$save(
            function success(admin, resHeader) {
              $location.path('/admins/' + admin.id);
            }, 
            function failure(res) {
              self.error = res.data;
              self.error.status = res.status;
            }
          );
        };
      }
    ]
  });
