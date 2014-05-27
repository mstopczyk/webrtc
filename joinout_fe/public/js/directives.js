joinoutApp.directive('loader', function ($rootScope) {
  return function ($scope, element, attrs) {
    jQuery(element).hide();
    $rootScope.$on('loader_show', function () {
      return jQuery(element).show();
    });
    $rootScope.$on('loader_hide', function () {
      return jQuery(element).hide();
    });
  };
});
