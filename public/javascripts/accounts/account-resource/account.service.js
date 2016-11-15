angular.
  module('accountResource').
  factory('Account', ['$resource',
    function($resource) {
      return $resource('/api/accounts/:id', {id:'@id'}, {});
    }
  ]);
