function onBackKeyDown(event) {
    var appElement = document.querySelector('[ng-app=app]');
    if (appElement) {
        event.preventDefault();
        event.stopPropagation();
        var appScope = angular.element(appElement).scope();
        var controllerScope = appScope.$$childHead;
        controllerScope.hardwareBackButtonClicked();
    }
}

var onDeviceReady = function () {
    //console.log(TestForWinJS.Class1.getAnswer());
    if (cordova.file === undefined) {
        // WP8
        if (device.platform === "Win32NT") {
            cordova.file = {
                dataDirectory: '///'
            }
        } else
            // Windows 8
            if (device.platform === "windows") {
                cordova.file = {
                    dataDirectory: 'ms-appdata:///local/'
                }
            }
    }
    function gotFS(fileSystem) {
        fileSystem.root.getDirectory("/pdfs", { create: true }, function (dirEntry) {
            console.log(dirEntry);
        });
    }
    /*window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, function () {
    });   
    WinJS.xhr({ url: "http://15.125.95.198/openemr/sites/phildemo/documents/1/Spirometer/20-03-2015_19.03.53_1.pdf", responseType: "blob" }).then(function onxhr(ab) {
        //console.log(ab);
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
            fileSystem.root.getDirectory("pdfs/myPdf", { create: true }, function (dir) {
                dir.getFile("20-03-2015_19.03.53_1.pdf", { create: true }, function (file) {
                    file.file(function (readable) {
                        var sampleReader = new FileReader();
                        sampleReader.onload = function (e) {
                            var decPdf = CryptoJS.AES.decrypt(sampleReader.result.split(',')[1], 'telehealthcare').toString(CryptoJS.enc.Latin1)
                            //console.log("Before Decryption: " + sampleReader.result.split(',')[1]);
                            //console.log("After Decryption: " + decPdf.toString(CryptoJS.enc.Latin1));
                            dir.getFile("temp.txt", { create: true }, function (fileTxt) {
                                fileTxt.createWriter(function (fileWriterT) {
                                    fileWriterT.seek(fileWriterT.length);
                                    var tempBlob = new Blob([decPdf], { type: 'text/plain' });
                                    fileWriterT.write(tempBlob);
                                    console.log("done");
                                });
                            });
                        }
                        sampleReader.readAsDataURL(readable);
                    }, function (e) { });*/
                    

                    //console.log("got the file", file);
                    //console.log(file);
                    /*logOb = file;
                    logOb.createWriter(function (fileWriter) {
                        fileWriter.seek(fileWriter.length);
                        blob = ab.response;
                        var reader = new FileReader();
                        reader.onload = function (event) {
                            //new sampleBlob = new Blob([(reader.result), 'application/pdf']);
                            //console.log(reader.result.split(',')[1]);
                            function base64toBlob(base64Data, contentType) {
                                contentType = contentType || '';
                                var sliceSize = 1024;
                                
                                
                                //console.log(window.atob(base64Data));
                                //console.log(base64Data);
                                //console.log(base64Data);
                                base64Data = CryptoJS.AES.encrypt(base64Data, 'telehealthcare').toString();
                                //console.log("After Encrypting: " + base64Data);
                                dir.getFile("temp.txt", { create: true }, function (fileTxt) {
                                    fileTxt.createWriter(function (fileWriterT) {
                                        fileWriterT.seek(fileWriterT.length);
                                        var sampleTxt = CryptoJS.AES.decrypt(base64Data, 'telehealthcare').toString(CryptoJS.enc.Latin1);
                                        var tempBlob = new Blob([sampleTxt], { type: 'text/plain' });
                                        fileWriterT.write(tempBlob);
                                        console.log("done");
                                    });
                                });
                                var byteCharacters = Base64.decode(base64Data);
                                //console.log(byteCharacters);
                                var bytesLength = byteCharacters.length;
                                var slicesCount = Math.ceil(bytesLength / sliceSize);
                                var byteArrays = new Array(slicesCount);

                                for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
                                    var begin = sliceIndex * sliceSize;
                                    var end = Math.min(begin + sliceSize, bytesLength);

                                    var bytes = new Array(end - begin);
                                    for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
                                        bytes[i] = byteCharacters[offset].charCodeAt(0);
                                    }
                                    byteArrays[sliceIndex] = new Uint8Array(bytes);
                                }
                                return new Blob(byteArrays, { type: contentType });
                            }
                            var sampleBlob = (base64toBlob(reader.result.split(',')[1], 'application/pdf'));
                            fileWriter.write(sampleBlob);
                          
                        };
                        //reader.readAsText(blob);
                        reader.readAsDataURL(blob);
                        //fileWriter.write(blob);
                       
                    }, function () {
                        console.log("failed");
                    });
                });
            });
        }, function () {
        console.log("failde")
        });
        //console.log(ab.response);
    }, function onerror() {
    });*/

    var appElement = document.querySelector('[ng-app=app]');
    var appScope = angular.element(appElement).scope();
    var myCypherkey = localStorage.getItem("cypherKey");
    if (myCypherkey != undefined && myCypherkey != "")
    {
        var cypherKey = CryptoJS.AES.decrypt(myCypherkey, "telehealthcare").toString(CryptoJS.enc.Utf8)
        appScope.db = window.sqlitePlugin.openDatabase({ name: "teleHealthDetails.db", key: cypherKey, location: 1 });
        if(localStorage.getItem("ngStorage-lastDbSync") != null)
        {
            var currentDateTime = new Date();
            var lastSync = new Date(localStorage.getItem("ngStorage-lastDbSync"));
            if (Math.abs((currentDateTime - lastSync) / 86400000) > 1) {
                /*localStorage.removeItem("ngStorage-lastDbSync");
                appScope.db.transaction(function (tx) {
                    var sqlQuery = 'DELETE FROM users';

                    tx.executeSql(sqlQuery, [], function (tx, res) {
                        console.log("Values from table user deleted.");
                        deferred.resolve(true);
                    });
                });*/
            }
        }
    }
    document.addEventListener("backbutton", onBackKeyDown, false);
    
}

document.addEventListener("deviceready", onDeviceReady, false);
//

var app = angular.module('app', [                           //defining angular js application module  named "app"
'templates-app',
"ui.router",
'ui.bootstrap',
'dialogs.main',
//'dialogs',
'ngCordova',
'ngPDFViewer',
'mn',
'app.directives.loginPage.loginMenu',
'app.directives.patientSearchPage.selectPatient',
'app.directives.patientSearchPage.selectAppointment',
'app.directives.patientDetailsPage.customChoiceView',
'app.directives.patientDetailsPage.customRelativeView',
'app.directives.patientSearchPage.addPatient',
'app.directives.popover',
'app.directives.numbersOnly',
'app.directives.lettersOnly',
'angular-websql',
'angular-svg-round-progress',
'ngIdle',
'ngScrollEvent',
'highcharts-ng',
'ngStorage',
'services.urlHitService',
'services.sqlCytherDb',
'services.windowsFileDownload',
'services.pdfSaverService'
]);

app.run(['$window', function ($window) {
    FastClick.attach(angular.element($window.document.body)[0]);
}]);

app.config(['$urlRouterProvider', '$stateProvider', '$httpProvider', 'KeepaliveProvider', 'IdleProvider', function ($urlRouterProvider, $stateProvider, $httpProvider, KeepaliveProvider, IdleProvider) {

    IdleProvider.idle(7200);
    IdleProvider.timeout(7200);
    KeepaliveProvider.interval(14400);

    $httpProvider.defaults.withCredentials = true;
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $urlRouterProvider.otherwise('/');                                                //for any unmatched url ,redirect to /
    $stateProvider

    .state('login', {                                                     //setting up different states in module config
        url: '/',
        templateUrl: 'templates/partials/login.html',
        controller: 'loginCtrl'
    })



    .state('patientSearch', {
        params: {
            patientDetailsObject: {
                patientID: 1,
                "patient": {
                    "email": null,
                    "provider": {
                        "id": null,
                        "fName": null,
                        "lName": null
                    },
                    "maritalStaus": null,
                    "ss": null,
                    "driverLicence": null,
                    "externalID": null,
                    "patientImageURL": null,
                    "userDefined": null,
                    "id": null,
                    "title": null,
                    "firstName": null,
                    "lastName": null,
                    "gender": null,
                    "dob": null
                },
                "contact": {
                    "patientID": null,
                    "street": null,
                    "postalCode": null,
                    "city": null,
                    "state": null,
                    "country": null,
                    "mothersName": null,
                    "guardiansName": null,
                    "emergencyContactName": null,
                    "homePhoneNumber": null,
                    "workPhoneNumber": null,
                    "mobilePhoneNumber": null,
                    "emergencyContactNumber": null
                },
                "notes": [
                ],
                appoinments: null,
                choice: null,
                employer: null,
                misc: null,
                stats: null,
                documents: null,       
                mainTabState: 0,
                piTabState: 0,
                issuesTabState:0,
                homeTabState: 0,
                historyTabState: 0,
                vitalsData: {
                    "WT": null,
                    "HT": null,
                    "BP": null,
                    "HR": null,
                    "RP": null,
                    "TP": null,
                    "os": null,
                    "HC": null,
                    "WC": null,
                    "BM": null
                },
                latestVitals: null,
                historyData: {
                    "general": null,
                    "familyHistory": null,
                    "relatives": null,
                    "lifestyle": null,
                    "other": null
                },
                medicalHistory: {
                    medicalProblems: null,
                    allergies: null,
                    medication: null,
                    immunization: null,
                    prescriptions: null,
                    surgeries: null,
                    dentalIssues:null
                },
                encounters: {
                    "asthma": "null",
                    "diabetes": "diabetes"
                },
                issues: null,
                disclosures: null,
                transactions: null,
                encounterData: null,
                encounterValues: {}

                
            },
            patientListData: {
                data: [],
                dataApointments: []
            }
        },
        url: '/patientSearch',
        templateUrl: 'templates/partials/patientSearch.html',
        controller: 'patientSearchCtrl'
    })

    .state('landingPage', {
        url: '/landingPage',
        templateUrl: 'templates/partials/landingPage.html',
        controller: 'landingPageCtrl'
    })

    .state('pdfViewerPage', {
        url: '/pdfViewerPage',
        templateUrl: 'templates/partials/pdfViewer.html',
        controller: 'pdfPageCtrl',
        params: {
            patientListData: {
                tabSelection: "id",
                setNumber: 0,
                dataLoaded: 0,
                dataToBeLoaded: 0,
                statusText: "No patient loaded",
                patient: {
                    dob: new Date(),
                    filterText: "",
                    gender: "Gender"
                },
                data: [],
                dataApointments: []
            },
            document: {
                "documentID": null,
                "documentName": null,
                "documentMimeType": null,
                "documentCategory": null,
                "documentURL": "20-03-2015_19.03.53_1.pdf",//"assets/pdf/test.pdf",
                "patientID": null,
                "documentUploadDate": null
            },
            patientDetailsObject: null
        }
    })

    .state('patientDetails', {
        params: {
            patientListData: {
                tabSelection: "id",
                setNumber: 0,
                patient: {
                    dob: new Date(),
                    filterText: "",
                    gender: "Gender"
                },
                data: [],
                dataApointments: []
            },
            patientDetailsObject: {
                patientID: -1,
                "patient": {
                    "email": null,
                    "provider": {
                        "id": null,
                        "fName": null,
                        "lName": null
                    },
                    "maritalStaus": null,
                    "ss": null,
                    "driverLicence": null,
                    "externalID": null,
                    "patientImageURL": null,
                    "userDefined": null,
                    "id": null,
                    "title": null,
                    "firstName": null,
                    "lastName": null,
                    "gender": null,
                    "dob": null
                },
                "contact": {
                    "patientID": null,
                    "street": null,
                    "postalCode": null,
                    "city": null,
                    "state": null,
                    "country": null,
                    "mothersName": null,
                    "guardiansName": null,
                    "emergencyContactName": null,
                    "homePhoneNumber": null,
                    "workPhoneNumber": null,
                    "mobilePhoneNumber": null,
                    "emergencyContactNumber": null
                },
                "notes": [
                ],
                appoinments: null,
                choice: null,
                employer: null,
                misc: null,
                stats: null,
                documents: null,
                mainTabState: 0,
                piTabState: 0,
                homeTabState: 0,
                issuesTabState:0,
                historyTabState: 0,
                vitalsData: {
                    "WT": null,
                    "HT": null,
                    "BP": null,
                    "HR": null,
                    "RP": null,
                    "TP": null,
                    "os": null,
                    "HC": null,
                    "WC": null,
                    "BM": null
                },
                latestVitals: null,
                historyData: {
                    "general": null,
                    "familyHistory": null,
                    "relatives": null,
                    "lifestyle": null,
                    "other": null
                },
                transactions:null,
                medicalHistory: {
                    medicalProblems: null,
                    allergies: null,
                    medication: null,
                    immunization: null,
                    prescriptions: null
                },
                encounters: {
                    "asthma": "null",
                    "diabetes": "diabetes"
                },
                issues: null,
                encounterData: null,
                encounterValues: {}
            }
        },
        url: '/patientDetails',
        templateUrl: 'templates/partials/patientDetails.html',
        controller: 'patientDetailsCtrl'
    })
}]);


