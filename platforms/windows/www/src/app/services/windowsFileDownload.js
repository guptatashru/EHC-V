var WindowsFileDownload = angular.module('services.windowsFileDownload',
    []);

WindowsFileDownload.factory('windowsFileDownload', ['$q', function ($q) {
    var service = {}
    service.getFile = function (url, fileName, location) {
        var deferred = $q.defer();
        WinJS.xhr({ url: url, responseType: "blob" }).then(function onxhr(ab) {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
                fileSystem.root.getDirectory("pdfs/" + location, { create: true }, function (dir) {
                    dir.getFile(fileName, { create: true }, function (file) {
                        console.log("got the file", file);
                        logOb = file;
                        logOb.createWriter(function (fileWriter) {

                            fileWriter.seek(fileWriter.length);
                            blob = ab.response;
                            fileWriter.write(blob);
                            /*var reader = new FileReader();
                            reader.onload = function (e) {
                                var encrypted = CryptoJS.AES.encrypt(e.target.result, password);
                                reader.readAsDataURL();
                            };*/
                            deferred.resolve({
                                saved: true,
                                url: "pdfs/" + location + "/" + fileName
                            });
                        }, function (e) {
                            console.log("failed");
                            deferred.resolve({
                                saved: false
                            });
                        });
                    }, function (e) {
                        deferred.resolve({
                            saved: false
                        });
                    });
                });
            }, function (e) {
                deferred.resolve({
                    saved: false
                });
            });
            //console.log(ab.response);
        }, function onerror(e) {
            deferred.resolve({
                saved: false
            });
        });
        return deferred.promise;
    }
    return service;
}]);