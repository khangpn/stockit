angular.
  module('sellerResource').
  factory('Seller', ['$resource',
    function($resource) {
      return $resource('/api/sellers/:id', {id:'@id'}, {});
    }
  ]);
