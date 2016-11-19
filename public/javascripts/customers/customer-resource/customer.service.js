angular.
  module('customerResource').
  factory('Customer', ['$resource',
    function($resource) {
      return $resource('/api/customers/:id', {id:'@id'}, {});
    }
  ]);
