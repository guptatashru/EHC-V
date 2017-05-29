angular.module('templates-app', [
    "login/urls",
    "templates/directives/loginPage/loginPage-loginMenu.html",
    "templates/directives/patientSearchPage/patientSearchPage-addPatient.html",
    "templates/directives/patientSearchPage/patientSearchPage-selectAppointment.html",
    "templates/directives/patientSearchPage/patientSearchPage-selectPatient.html",
    "templates/directives/patientSearchPage/filterType-datePicker.html",
    "templates/directives/patientSearchPage/filterType-dropDown.html",
    "templates/directives/patientSearchPage/filterType-textBox.html",
    "templates/directives/patientDetailsPage/patientDetailsPage-customRelativesHistoryView.html",
    "templates/directives/patientDetailsPage/patientDetailsPage-customChoiceView.html",
    "templates/directives/patientDetailsPage/demoGraphicsTabContents",
    "templates/directives/patientDetailsPage/historyTabContents",
    "templates/directives/patientDetailsPage/homeTabContents",
    "templates/directives/patientDetailsPage/mainTabContents",
    "templates/dialogs"
]);

angular.module("login/urls", []).run(["$rootScope", "$http", function ($rootScope, $http) {
    $http.get("src/common/source/urlSources.json")
        .success(function (data, status, headers, config) {
            $rootScope.urls = data.url;
        })
    .error(function (data, status, headers, config) {
        console.log("error Loading data");
    });
}]);

angular.module("templates/partials", []).run(["$templateCache", "$http", function ($templateCache, $http) {
    $http.get('templates/partials/landingPage.html', { cache: $templateCache });
    $http.get('templates/partials/login.html', { cache: $templateCache });
    $http.get('templates/partials/patientDetails.html', { cache: $templateCache });
    $http.get('templates/partials/patientSearch.html', { cache: $templateCache });
    $http.get('templates/partials/pdfViewer.html', { cache: $templateCache });
}]);
angular.module("templates/directives/loginPage/loginPage-loginMenu.html", []).run(["$templateCache", "$http", function ($templateCache, $http) {
    $http.get('templates/directives/loginPage/loginPage-loginMenu.html', { cache: $templateCache });
}]);
angular.module("templates/directives/patientSearchPage/patientSearchPage-addPatient.html", []).run(["$templateCache", "$http", function ($templateCache, $http) {
    $http.get('templates/directives/patientSearchPage/patientSearchPage-addPatient.html', { cache: $templateCache });
}]);
angular.module("templates/directives/patientSearchPage/patientSearchPage-selectAppointment.html", []).run(["$templateCache", "$http", function ($templateCache, $http) {
    $http.get('templates/directives/patientSearchPage/patientSearchPage-selectAppointment.html', { cache: $templateCache });
}]);
angular.module("templates/directives/patientSearchPage/patientSearchPage-selectPatient.html", []).run(["$templateCache", "$http", function ($templateCache, $http) {
    $http.get('templates/directives/patientSearchPage/patientSearchPage-selectPatient.html', { cache: $templateCache });
}]);
angular.module("templates/directives/patientSearchPage/filterType-datePicker.html", []).run(["$templateCache", "$http", function ($templateCache, $http) {
    $http.get('templates/directives/patientSearchPage/filterType-datePicker.html', { cache: $templateCache });
}]);
angular.module("templates/directives/patientSearchPage/filterType-dropDown.html", []).run(["$templateCache", "$http", function ($templateCache, $http) {
    $http.get('templates/directives/patientSearchPage/filterType-dropDown.html', { cache: $templateCache });
}]);
angular.module("templates/directives/patientSearchPage/filterType-textBox.html", []).run(["$templateCache", "$http", function ($templateCache, $http) {
    $http.get('templates/directives/patientSearchPage/filterType-textBox.html', { cache: $templateCache });
}]);
angular.module("templates/directives/patientDetailsPage/patientDetailsPage-customRelativesHistoryView.html", []).run(["$templateCache", "$http", function ($templateCache, $http) {
    $http.get('templates/directives/patientDetailsPage/patientDetailsPage-customRelativesHistoryView.html', { cache: $templateCache });
}]);
angular.module("templates/directives/patientDetailsPage/patientDetailsPage-customChoiceView.html", []).run(["$templateCache", "$http", function ($templateCache, $http) {
    $http.get('templates/directives/patientDetailsPage/patientDetailsPage-customChoiceView.html', { cache: $templateCache });
}]);
angular.module("templates/directives/patientDetailsPage/demoGraphicsTabContents", []).run(["$templateCache", "$http", function ($templateCache, $http) {
    $http.get('templates/directives/patientDetailsPage/demoGraphicsTabContents/choiceTabContent.html', { cache: $templateCache });
    $http.get('templates/directives/patientDetailsPage/demoGraphicsTabContents/contactTabContent.html', { cache: $templateCache });
    $http.get('templates/directives/patientDetailsPage/demoGraphicsTabContents/employerTabContent.html', { cache: $templateCache });
    $http.get('templates/directives/patientDetailsPage/demoGraphicsTabContents/miscTabContent.html', { cache: $templateCache });
    $http.get('templates/directives/patientDetailsPage/demoGraphicsTabContents/statsTabContent.html', { cache: $templateCache });
}]);
angular.module("templates/directives/patientDetailsPage/historyTabContents", []).run(["$templateCache", "$http", function ($templateCache, $http) {
    $http.get('templates/directives/patientDetailsPage/historyTabContents/familyHistoryTabSelectionPage.html', { cache: $templateCache });
    $http.get('templates/directives/patientDetailsPage/historyTabContents/generalTabSelectionPage.html', { cache: $templateCache });
    $http.get('templates/directives/patientDetailsPage/historyTabContents/lifestyleTabSelectionPage.html', { cache: $templateCache });
    $http.get('templates/directives/patientDetailsPage/historyTabContents/otherTabSelectionPage.html', { cache: $templateCache });
    $http.get('templates/directives/patientDetailsPage/historyTabContents/relativesTabSelectionPage.html', { cache: $templateCache });
}]);
angular.module("templates/directives/patientDetailsPage/homeTabContents", []).run(["$templateCache", "$http", function ($templateCache, $http) {
    $http.get('templates/directives/patientDetailsPage/homeTabContents/medicalHistoryTabSelectionPage.html', { cache: $templateCache });
    $http.get('templates/directives/patientDetailsPage/homeTabContents/patientInfoTabSelectionPage.html', { cache: $templateCache });
    $http.get('templates/directives/patientDetailsPage/homeTabContents/remindersTabSelectionPage.html', { cache: $templateCache });
    $http.get('templates/directives/patientDetailsPage/homeTabContents/vitalsTabSelectionPage.html', { cache: $templateCache });
}]);
angular.module("templates/directives/patientDetailsPage/mainTabContents", []).run(["$templateCache", "$http", function ($templateCache, $http) {
    $http.get('templates/directives/patientDetailsPage/mainTabContents/documentsTabSelectionPage.html', { cache: $templateCache });
    $http.get('templates/directives/patientDetailsPage/mainTabContents/historyTabSelectionPage.html', { cache: $templateCache });
    $http.get('templates/directives/patientDetailsPage/mainTabContents/homeTabSelectionPage.html', { cache: $templateCache });
    $http.get('templates/directives/patientDetailsPage/mainTabContents/reportsTabSelectionPage.html', { cache: $templateCache });
}]);

angular.module("templates/dialogs", []).run(["$templateCache", "$http", function ($templateCache, $http) {
    $http.get('templates/dialogs/datePicker.html', { cache: $templateCache });
    $http.get('templates/dialogs/loadingDialog.html', { cache: $templateCache });
    $http.get('templates/dialogs/successDialog.html', { cache: $templateCache });
}]);