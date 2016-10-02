angular.
  module('stockit').
  component('itemList', {
    templateUrl: '/items/partials/list',
    controller: function ItemListController() {
      this.items = [
        {
          id: 1,
          code: 'qwertyuiop',
          name: 'table',
          price: 100,
          in_stock: 83
        },
        {
          id: 2,
          code: 'L1',
          name: 'laptop',
          price: 100,
          in_stock: 79
        }
      ]
    }
  });
