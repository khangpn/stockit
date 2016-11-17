angular.
  module('itemDetail').
  component('itemDetail', { 
    templateUrl: '/items/partials/detail',
    controller: ['$routeParams', '$location', 'Item',
      function ItemDetailController($routeParams, $location, Item) {
        var self = this;
        this.item = Item.get({id:$routeParams.itemId},
          function success(item, resHeader) {}, 
          function error(res) {
            self.error = res.data;
            self.error.status = res.status;
          }
        );
        //$http.get('/api/items/' + $routeParams.itemId).then(function(response) {
        //  self.item = response.data;
        //});

        //Deletting is handled in core/delete-confirm
        //var self = this;
        //this.deleteItem = function() {
        //  self.item.$delete(
        //    function success(item, resHeader) {
        //      $location.path('/');
        //    }, 
        //    function failure(response) {
        //      self.errors = response.data.errors;
        //    }
        //  );
        //};

        this.editItem = function() {
          $location.path('/items/'+this.item.id+'/edit');
        };
      }
    ]
  });
