angular.
  module('adminResource').
  factory('Admin', ['$resource',
    function($resource) {
      return $resource('/api/admins/:id', {id:'@id'}, {
        'updatePassword': {
          method: 'POST',
          url: '/api/admins/:id/password/update'
        }
      });
    }
  ]);
