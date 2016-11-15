angular.
  module('core').
  filter('istrue', function() {
    return function(input) {
      return input ? '\u2713' : '\u2718';
    };
  });

