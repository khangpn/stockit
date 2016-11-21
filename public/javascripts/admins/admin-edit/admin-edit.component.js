angular.
  module('adminEdit').
  component('adminEdit', { 
    templateUrl: '/admins/partials/edit',
    controller: ['$routeParams', '$location', 'Admin',
      function AdminEditController($routeParams, $location, Admin) {
        var self = this;
        this.admin = Admin.get({id:$routeParams.adminId},
          function success(admin, resHeader) {}, 
          function failure(res) {
            self.error = res.data;
            self.error.status = res.status;
          }
        );

        this.save = function(admin) {
          admin.$save(
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
