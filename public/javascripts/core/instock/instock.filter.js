angular.
  module('core').
  filter('instock', function() {
    return function(input) {
      return input > 0 ? '\u2713' : '\u2718';
    };
  });
