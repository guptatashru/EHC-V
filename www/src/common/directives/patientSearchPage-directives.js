angular.module('app.directives.patientSearchPage.selectPatient', [])
    .directive('selectPatient', function () {
        return {
            restrict: 'EA',
            scope: {

            },
            templateUrl: 'templates/directives/patientSearchPage/patientSearchPage-selectPatient.html',
            controller: 'selectPatientCtrl'
        }
    });

angular.module('app.directives.patientSearchPage.selectAppointment', [])
    .directive('selectAppointment', function () {
        return {
            restrict: 'EA',
            scope: {

            },
            templateUrl: 'templates/directives/patientSearchPage/patientSearchPage-selectAppointment.html',
            controller: 'selectAppointmentCtrl'
        }
    });
angular.module('app.directives.patientSearchPage.addPatient', [])
    .directive('addPatient', function () {
        return {
            restrict: 'EA',
            scope: {

            },
            templateUrl: 'templates/directives/patientSearchPage/patientSearchPage-addPatient.html',
            controller: 'addPatientCtrl'
        }
    });
angular.module('app.directives.numbersOnly', [])
.directive('numbersOnly', function (){

    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9-]/g, '');
                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
angular.module('app.directives.lettersOnly', [])
.directive('lettersOnly', function () {
    return {
        require: 'ngModel',
        scope: {
            regex: '@lettersOnly',
            with: '@with'
        }, 
        link: function(scope, element, attrs, model) {
            model.$parsers.push(function(val) {
                if (!val) { return; }
                var regex = new RegExp(scope.regex);
                var replaced = val.replace(regex, scope.with);
                if (replaced !== val) {
                    model.$setViewValue(replaced);
                    model.$render();
                }         
                return replaced;         
            });
        }
       
    };
})