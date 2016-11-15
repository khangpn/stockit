angular.
  module('core').
  filter('instock', function() {
    return function(input) {
      return input > 0 ? '\u2713 (' + input + ' pieces)' : '\u2718';
    };
  });
