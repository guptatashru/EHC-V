angular.module('app.directives.loginPage.selectUsername', [])
    .directive('selectUsername', function () {
        return {
            restrict: 'EA',
            scope: {

            },
            templateUrl: 'templates/directives/loginPage/loginPage-selectUsername.html',
            controller: 'selectUsernameCtrl'
        }
    });

angular.module('app.directives.loginPage.selectState', [])
    .directive('selectState', function () {
        return {
            restrict: 'EA',
            scope: {
                states: '='
            },
            templateUrl: 'templates/directives/loginPage/loginPage-selectState.html',
            controller: 'selectStateCtrl'
        }
    });

angular.module('app.directives.loginPage.selectPassword', [])
    .directive('selectPassword', function () {
        return {
            restrict: 'EA',
            scope: {

            },
            templateUrl: 'templates/directices/loginPage/loginPage-selectPassword.html',
            controller: 'selectPasswordCtrl'
        }
    });

angular.module('app.directives.loginPage.selectDistrict', [])
    .directive('selectDistrict', function () {
        return {
            restrict: 'EA',
            scope: {
                districts: '='
            },
            templateUrl: 'templates/directices/loginPage/loginPage-selectDistrict.html',
            controller: 'selectDistrictCtrl'
        }
    });

angular.module('app.directives.loginPage.clickLogin', [])
    .directive('clickLogin', function () {
        return {
            restrict: 'EA',
            scope: {

            },
            templateUrl: 'templates/directives/loginPage/loginPage-clickLogin.html',
            controller: 'clickLoginCtrl'
        }
    });

angular.module('app.directives.loginPage.selectCountry', [])
    .directive('selectCountry', function () {
        return {
            restrict: 'EA',
            scope: {
                countries: '='
            },
            templateUrl: 'templates/directives/loginPage/loginPage-selectCountry.html',
            controller: 'selectCountryCtrl'
        }
    });

angular.module('app.directives.loginPage.loginMenu', [])
    .directive('loginMenu', function () {
        return {
            restrict: 'EA',
            scope: {
                
            },
            templateUrl: 'templates/directives/loginPage/loginPage-loginMenu.html',
            controller: 'loginMenuCtrl'
        }
    });