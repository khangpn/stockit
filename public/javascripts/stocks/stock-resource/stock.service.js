angular.
  module('stockResource').
  factory('Stock', ['$resource',
    function($resource) {
      return $resource('/api/stocks/:id', {id:'@id'}, {});
    }
  ]);
