var myApp = angular.module('myApp', [
  'ngRoute',
  'myControllers',
]);

myApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $routeProvider.

    when('/', {
      templateUrl: '/partials/home.html',
      controller: 'IndexController'
    }).

    when('/about', {
      templateUrl: '/partials/about.html',
    }).


    when('/contact', {
      templateUrl: '/partials/contact.html',
    }).

    when('/search', {
      templateUrl: '/partials/search.html',
      controller: 'SearchController'
    }).

    when('/contracts', {
      templateUrl: '/partials/search.html',
      controller: 'SearchController'
    }).

    when('/contract/:id', {
      templateUrl: '/partials/contract.html',
      controller: 'ContractController'
    }).

    otherwise({
      redirectTo: '/'
    });

    $locationProvider.html5Mode(true);


}]);


myApp.filter('rawHtml', ['$sce', function($sce){
  return function(val) {
    return $sce.trustAsHtml(val);
  };
}]);

myApp.filter('trueFalse', [ function($sce) {
  return function(input) {
    if (input == 1) {
      return 'True'
    }
    else {
      return 'False'
    }

  }
}]);


myApp.directive('bindHtmlCompile', ['$compile', function ($compile) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      scope.$watch(
        function (scope) {
          return scope.$eval(attrs.bindHtmlCompile);
        },
        function (value) {
          element.html(value);
          $compile(element.contents())(scope);
        }
      );
    }
  }
}]);


myApp.directive('slider', function() {
  return {
    link: function(scope, element, attrs) {
      var bxslider;
      bxslider = $('.bxslider').bxSlider({
        adaptiveHeight: true,
        mode: 'fade',
        preloadImages: 'all',
        controls: false,
        pagerSelector: $('.pagerSelector')
      });

      $('.bx-wrapper').on('click', function() {
        bxslider.goToNextSlide();
      });
    }
  }
});

myApp.directive('responsiveView', function() {
  return {
    link: function(scope, element, attr) {
      var iframe = $('#responsive-view');
      var control = $('.responsive-view-control');

      control.find('a').on('click', function(e) {
        iframe.removeAttr('class').addClass($(this).attr('data-view'));

        control.find('a').each(function() {
          $(this).removeClass('active');
        });

        $(this).addClass('active');

        e.preventDefault();
        return false;
      });

    }
  }
});

function getParam(param) {
  var found;
  window.location.search.substr(1).split("&").forEach(function(item) {
    if (param ==  item.split("=")[0]) {
      found = item.split("=")[1];
    }
  });
  return found;
}

function deleteByValue(val, obj) {
  for(var f in obj) {
    if(obj[f] == val) {
      delete obj[f];
    }
  }
}

function download(filename, url) {
  var element = document.createElement('a');
  $.ajax({
    url: '/proxy.php',
    data: {
      csurl: url
    },
    success: function(data) {

      var data = '<meta http-equiv="Content-type" content="text/html; charset=utf-8" />' + data;

      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
      element.setAttribute('download', filename);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);

      console.log('fdsfs');

      console.log(data);

    }
  });

}

function closeSidebar() {
  if ($('.sidebar-collapse-container.out').length) {
    $('.navbar-header .trigger').click();
  }
}

function contactFormSubmit(e) {
  console.log( $(e).serialize() );

  $.ajax({
    url: '/mailer.php',
    data: $(e).serialize(),
    type: 'POST',
    success: function(data) {
      if (data == "Success") {
        $('.form-message').html("Your message has been sent!");
        $(e)[0].reset();
      } else {
        $('.form-message').html("Something went wrong, please try again");
      }
    },
    error: function() {
      $('.form-message').html("Something went wrong, please try again");
    }
  })

}
