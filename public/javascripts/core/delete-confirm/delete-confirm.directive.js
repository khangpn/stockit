angular.
  module('core').
  directive('deleteConfirm', ['$http', '$location', function($http, $location) {
    return {
      restrict: 'A',
      scope: {
        objectId: "@", //Read https://docs.angularjs.org/guide/directive
        objectType: "@"
      },
      link: function (scope, elem, attr) {
        // Config the dialog
        $("#dialog-confirm").dialog({
          autoOpen: false,
          resizable: false,
          height: "auto",
          width: 400,
          modal: true,
          buttons: {
            "Delete": function() {
              var actionPath = '/api/' + scope.objectType + '/' + scope.objectId;
              var self = this;
              $http.delete(actionPath).then(function(response) {
                $(self).dialog( "close" );
                $location.path('/');
              });
            },
            Cancel: function() {
              $( this ).dialog( "close" );
            }
          }
        });

        // This is from Jquery and JqueryUI, trigger the dialog
        elem.on("click", function(e) {
          $("#dialog-confirm").dialog('open');
        });
      }
    };
  }]);
