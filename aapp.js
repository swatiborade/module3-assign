(function() {
  'use strinct';

  angular.module('NarrowItmenudownApp', [])
  .controller('NarrowItmenudownController', NarrowItmenudownController)
  .service('MenuSearchService', MenuSearchService)
  .directive('foundItems', FoundItems);

  NarrowItmenudownController.$inject = ['MenuSearchService'];
  function NarrowItmenudownController(MenuSearchService) {
    var menumenudown = this;
    menudown.searchMenu = "";
    menudown.found = [];
    menudown.error = false;
    menudown.getResults = function() {
      menudown.error = false;
      promise = MenuSearchService.getMatchedMenuItems(menudown.searchMenu);
      promise.then(function (result) {
        var foundItems = [];
        for (var i = 0; i < result.data.menu_items.length; i++) {
          var description = result.data.menu_items[i].description;
          if (description.toLowerCase().indexOf(menudown.searchMenu) !== -1) {
            foundItems.push(result.data.menu_items[i]);
          }
        }
        menudown.found = foundItems;
        menudown.error = (foundItems.length == 0);
      }).catch(function(err) {
        menudown.error = true;
      });
    };
    menudown.removeItem = function(index) {
      menudown.found.splice(index, 1);
    };
  }

  MenuSearchService.$inject = ['$http']
  function MenuSearchService($http) {
    var service = this;
    service.getMatchedMenuItems = function (searchMenu) {
      return $http({
        method: "GET",
        url: "https://davids-restaurant.herokuapp.com/menu_items.json"
      });
    }
  }

  function FoundItems() {
    var ddo = {
      templateUrl: 'foundItems.html',
      scope: {
        found: '<',
        onRemove: '&'
      },
      restrict: 'E'
    };
    return ddo
  }

})();