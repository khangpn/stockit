angular.
  module('orderResource').
  factory('Order', ['$resource',
    function($resource) {
      return $resource('/api/orders/:id', {id:'@id'}, {});
    }
  ]);
