angular.
  module('itemResource').
  factory('Item', ['$resource',
    function($resource) {
      return $resource('/api/items/:id', {id:'@id'}, {});
    }
  ]);
