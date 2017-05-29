var pdfSaver = angular.module('services.pdfSaverService',
    ['services.sqlCytherDb']);

pdfSaver.factory('pdfSaver', ['$q', 'sqlCypherDb', function ($q, sqlCypherDb) {
    var service = {}
    service.saveFileToDb = function (url, fileName) {
        var deferred = $q.defer();
        var oReq = new XMLHttpRequest();
        oReq.onload = function (e) {
            var BASE64_MARKER = ';base64,';
            function extractBase64String(dataURI) {
                var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
                var base64 = dataURI.substring(base64Index);
                return base64;
            }
            var reader = new FileReader();
            reader.onload = function (event) {
                var baseString = extractBase64String(reader.result);
                sqlCypherDb.insertIntoTable('pdfs', ['pdfName', 'pdfBase64'], [fileName, baseString]).then(function (r) {
                    deferred.resolve(true);
                });
            };
            reader.readAsDataURL(oReq.response);
        };
        oReq.open("GET", url);
        oReq.responseType = "blob";
        oReq.send();
        return deferred.promise;
    }
    service.fetchFile = function (fileName) {
        var deferred = $q.defer();
        sqlCypherDb.selectFromTable('pdfs', '*', "pdfName=\"" + fileName + "\"").then(function (res) {
            deferred.resolve(res.item(0).pdfBase64);
        });
        return deferred.promise;
    };
    return service;
}]);