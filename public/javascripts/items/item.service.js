angular.
  module('item').
  factory('Item', ['$resource',
    function($resource) {
      return $resource('/api/items/:id', {}, {});
    }
  ]);
