angular.module('app.directives.patientDetailsPage.customChoiceView', [])
    .directive('customChoiceView', function () {
        return {
            restrict: 'EA',
            scope: {
                text: '@text',
                choice: '@choice'
            },
            templateUrl: 'templates/directives/patientDetailsPage/patientDetailsPage-customChoiceView.html',
            controller: 'customChoiceViewCtrl'
        }
    });

angular.module('app.directives.patientDetailsPage.customRelativeView', [])
    .directive('customRelativesHistoryView', function () {
        return {
            restrict: 'EA',
            scope: {
                text: '@text',
                info: '@info',
                date: '@date',
                choice: '@choice'
            },
            templateUrl: 'templates/directives/patientDetailsPage/patientDetailsPage-customRelativesHistoryView.html',
            controller: 'customRelativeCtrl'
        }
    });

angular.module('app.directives.popover', [])
    .directive('popOver', function ($compile) {
        var itemsTemplate = "<div id='popoverContentsDiv'><table ng-show='valueAwailable' class='encVisible table table-striped'><thead><tr><td>Date</td><td>Presenting Complaint</td></tr></thead><tbody><tr ng-repeat='item in value track by $index'><td>{{item.encounterDate | date: 'dd-MM-yyyy'}}</td><td>{{item.presentingComplaint}}</td></tr></tbody></table><button class='transparentButton encVisible buttonFull' ng-hide='valueAwailable'><img src='assets/images/ajax_loader.gif'/></button></div>";
    var getTemplate = function (contentType) {
        var template = '';
        switch (contentType) {
            case 'items':
                template = itemsTemplate;
                break;
        }
        return template;
    }
    return {
        restrict: "A",
        transclude: true,
        template: "<span ng-transclude></span>",
        link: function (scope, element, attrs) {
            scope.$watch("items", function (newValue, oldValue) {
                if (scope.items != "null") {
                    scope.value = JSON.parse(scope.items);
                    scope.valueAwailable = true;
                }
            }, true);
            var popOverContent;
            if (scope.items) {
                var html = getTemplate("items");
                popOverContent = $compile(html)(scope);                    
            }
            var options = {
                content: popOverContent,
                placement: "left",
                html: true
            };
            //$(element).popover(options);
            $(element).popover(options);
            $('html').on('click', function (e) {
                if (typeof $(e.target).data('original-title') == 'undefined' &&
                   !$(e.target).parents().is('.popover.in')) {
                    $('[data-original-title]').popover('hide');
                }
            });
        },
        scope: {
            items: '@items'
        },
        controller: 'popOverCtrl'
    };
    });




