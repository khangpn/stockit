angular.
  module('itemEdit').
  component('itemEdit', { 
    templateUrl: '/items/partials/edit',
    controller: ['$routeParams', '$location', 'Item',
      function ItemEditController($routeParams, $location, Item) {
        var self = this;

        this.item = Item.get({id:$routeParams.itemId},
          function success(item, resHeader) {}, 
          function failure(res) {
            self.error = res.data;
            self.error.status = res.status;
          }
        );

        this.save = function(item) {
          item.$save(
            function success(item, resHeader) {
              $location.path('/items/' + item.id);
            }, 
            function failure(res) {
              self.error = res.data;
              self.error.status = res.status;
            }
          );
        };
      }
    ]
  });
