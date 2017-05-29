//var softkeyboard = window.cordova.plugins.SoftKeyBoard;

app.controller('loginCtrl', ['$scope', '$http', '$location', '$state', 'dialogs', '$rootScope', 'sqlCypherDb', function ($scope, $http, $location, $state, dialogs, $rootScope, sqlCypherDb) {       //adding a controller function "loginCtrl to module "app"
    // sqlCypherDb.executeSql();
    $scope.hardwareBackButtonClicked = function () {
        navigator.app.exitApp();
    }
    $scope.loaderGifClass = { display: "none" };
    /*urlHitService.hitUrl("https://ehctemporary.azurewebsites.net/vitals/detail/BP/12/1").then(function (result) {
        console.log(result);
    });
    */
    $scope.countries = [
    'Phelipines',
    'UAE'
    ];


    $scope.states = {
        'Phelipines': ['Apayao', 'Cagayan'],
        'UAE': ['Dubai', 'Aline']
    };


    $scope.statesBasedOnCountry = [];


    $scope.$on('loginPage.countryChanged', function (event, args) {
        $scope.statesBasedOnCountry = $scope.states[args.country];
    });

    $scope.$on('loginPage.onLoginFalied', function (event, args) {
        //console.log(args);
        $scope.loginMessage = args.newloginMessage.text;
        $scope.loginMessageStyleClass = args.newloginMessage.style;
    });
    
}]);


app.controller('landingPageCtrl', function ($scope, $http, $location, $state, Idle, Keepalive) {

    $scope.$on('IdleStart', function () {
        console.log("idle start");
    });

    $scope.$on('IdleEnd', function () {
        console.log("idle End");
    });

    $scope.$on('IdleTimeout', function () {
        //console.log("idle timesout");
        $state.go('login');
    });

    $scope.start = function () {
        Idle.watch();
        $scope.started = true;
    };

    $scope.stop = function () {
        Idle.unwatch();
        $scope.started = false;

    };

    $scope.start();
});

app.controller('pdfPageCtrl', function ($scope, $http, Idle, Keepalive, $state, $stateParams) {
    $scope.hardwareBackButtonClicked = function () {
        //$state.go('patientDetails', { patientDetailsObject: $stateParams.patientDetailsObject });
        $state.go('patientDetails', { patientListData: $stateParams.patientListData, patientDetailsObject: null });
    }

    $scope.$on('IdleStart', function () {
        console.log("idle start");
    });

    $scope.$on('IdleEnd', function () {
        console.log("idle End");
    });

    $scope.$on('IdleTimeout', function () {
        $scope.logoutUrl = $rootScope.urls.logoutUrl;
        $http.get($scope.logoutUrl).
           success(function (data, status, headers, config) {
               console.log("logged Out");
               $state.go('login');
           }).
           error(function (data, status, headers, config) {
               console.log("logged Out error");
               $state.go('login');
           });

    });

    $scope.start = function () {
        Idle.watch();
        $scope.started = true;
    };

    $scope.stop = function () {
        Idle.unwatch();
        $scope.started = false;

    };

    $scope.start();
    $scope.loaderGifClass = { "display": "block" };

});


app.controller('pdfViewerCtrl', ['$scope', '$sce', '$http', '$location', '$state', 'PDFViewerService', '$stateParams', '$rootScope', function ($scope, $sce, $http, $location, $state, pdf, $stateParams, $rootScope) {
    $scope.patientDetailsPageData = $stateParams.patientDetailsObject;
    //console.log($scope.patientDetailsPageData)
    $scope.pdfDocumentName = $stateParams.document.documentName;

    $scope.pdfURL = $sce.trustAsResourceUrl($stateParams.document.documentURL);

    $scope.instance = pdf.Instance("viewer");

    $scope.$on('pdfViewer-pdfLoaded', function () {
        document.getElementById("pageLoadingGif").style.display = "none";
        //console.log("pdf Loaded");
        //$scope.loaderGifClass.display = "none";
    });

    $scope.nextPage = function () {
        $scope.instance.nextPage();
        //console.log($scope.totalPages);
    };

    $scope.prevPage = function () {
        $scope.instance.prevPage();
    };

    $scope.gotoPage = function (page) {
        $scope.instance.gotoPage(page);
    };

    $scope.zoomIn = function () {

        $scope.instance.zoomIn();
    }

    $scope.zoomOut = function () {
        $scope.instance.zoomOut();
    }

    $scope.pageLoaded = function (curPage, totalPages) {
        //console.log("finished loading");
        $scope.currentPage = curPage;
        $scope.totalPages = totalPages;
    };

    $scope.loadProgress = function (loaded, total, state) {
        //console.log('loaded =', loaded, 'total =', total, 'state =', state);
    };
    $scope.backButtonClicked = function () {

        //$scope.patientDetailsPageData.mainTabState = 3;
        $state.go('patientDetails', { patientListData: $stateParams.patientListData, patientDetailsObject: $rootScope.patientDetailsToBeDisplayed });

    }
}]);

//login page directive controller set

app.controller('selectCountryCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.countryValue = "select country"

    $scope.countryChanged = function () {
        $rootScope.$broadcast('loginPage.countryChanged', { country: $scope.countryValue });
    }

    $scope.countrySelected = function (countrySelected) {
        $scope.countryValue = countrySelected;
        $scope.countryChanged();
    }
}]);

app.controller('selectStateCtrl', ['$scope', function ($scope) {

    $scope.stateValue = "select state"

    $scope.stateSelected = function (stateSelected) {
        $scope.stateValue = stateSelected;

    }
}]);

app.controller('selectDistrictCtrl', ['$scope', function ($scope) {

    $scope.districtValue = "select district"

    $scope.districtSelected = function (districtSelected) {
        $scope.districtValue = districtSelected;

    }
}]);

app.controller('selectUsernameCtrl', ['$scope', function ($scope) {
    $scope.username = "";



}]);

app.controller('selectPasswordCtrl', ['$scope', function ($scope) {
    $scope.password = "";



}]);

app.controller('clickLoginCtrl', ['$scope', function ($scope) {
    $scope.login = "";



}]);

app.controller('loginMenuCtrl', ['$scope', '$http', '$state', '$rootScope', '$localStorage', 'sqlCypherDb', '$interval', function ($scope, $http, $state, $rootScope, $localStorage, sqlCypherDb, $interval) {

    delete $localStorage.loginUrl;
    $scope.$storage = $localStorage.$default({
        loginUrl: $rootScope.urls.dummyLoginUrl,
        userName: "",
        passWord: "",
        cypherKey: ""
    });
    $scope.loginMessage = "Please login to get started";                                                                  //attaching "loginMessage" property to $scope object
    $scope.onlineStatus = "OFFLINE";
    $scope.onlineStatusStyleClass = {
        "display": "block",
        "color": "yellow"
    };
    $scope.loginMessageStyleClass = {
        "color": "white",
        "font-size": "150%",

    };
    //$scope.$storage.userName = "";
    $scope.password = CryptoJS.AES.decrypt($scope.$storage.passWord, "telehealthcare").toString(CryptoJS.enc.Utf8);
    $scope.username = $scope.$storage.userName;
    $scope.buttonText = "LOGIN";
    $scope.loginButtonDisabled = false;
    $rootScope.appoinementData = [];
    $scope.keyDownEvent = function (e) {
        //console.log(e);
        if (e.keyCode == 13) {
            //$scope.softKeyboard = window.cordova.plugins.SoftKeyBoard;
            //$scope.softKeyboard.hide();
            if (!$scope.loginButtonDisabled)
                $scope.onLoginClicked();
        }
    }
    /*$scope.getDeviceOnlineStatus = function()
    {
        var req = {
            methog: "GET",
            config: { timeout : 20},
            url: "http://api.geonames.org/findNearbyJSON?lat=47.3&lng=9&username=demo"
        };
        $http(req).then(function (data, status, headers, config) {
            $scope.onlineStatus = "ONLINE";
            $scope.onlineStatusStyleClass.display = "none";
            $interval($scope.getDeviceOnlineStatus, 100, 1);
        }, function (data, status, headers, config) {
            $scope.onlineStatus = "OFFLINE";
            $scope.onlineStatusStyleClass.display = "block";
            $interval($scope.getDeviceOnlineStatus, 100, 1);
        });
    }

    $interval($scope.getDeviceOnlineStatus, 100, 1);*/
    $scope.loginOffilne = function()
    {
        if ($localStorage.lastDbSync) {
            $scope.loginMessage = "Going offline.";
            sqlCypherDb.selectFromTable('users', '*').then(function (result) {
                var loginSuccess = false;
                for (var i = 0; i < result.length; i++) {
                    var currentRow = result.item(i);
                    if ($scope.username == currentRow.name && $scope.password == CryptoJS.AES.decrypt(currentRow.password, "telehealthcare").toString(CryptoJS.enc.Utf8)) {
                        console.log("user matched going offline");
                        var loginSuccess = true;
                        $rootScope.onlineLogin = false;
                        sqlCypherDb.selectFromTable('appointments', '*').then(function (result) {

                            for (var i = 0; i < result.length; i++) {
                                var tempAppoinements = result.item(i);
                                $rootScope.appoinementData.push(JSON.parse(tempAppoinements.appointmentData));
                            }
                            $state.go('patientSearch');
                        });

                        break;
                    }
                    if(loginSuccess == false)
                    {
                        $scope.loginMessage = "Login failed. Invalid Username/Password.";
                        $scope.loginMessageStyleClass.color = "red";
                        $scope.loginMessageStyleClass["font-size"] = "100%";
                    }
                }
                
            });
        }
        else
        {
            $scope.loginMessage = "Login failed. Connection Error.";
            $scope.loginMessageStyleClass.color = "red";
            $scope.loginMessageStyleClass["font-size"] = "100%";
        }
    }
    $scope.onLoginClicked = function () {
        //$state.go('patientSearch');
        //sqlCypherDb.closeUserDb();
        $scope.$parent.loaderGifClass.display = "block";
        $scope.loginButtonDisabled = true;
        $scope.url = $rootScope.urls.loginUrl;
        $scope.url += "/" + $scope.username;
        $scope.url += "/" + CryptoJS.SHA1($scope.password).toString(CryptoJS.enc.Hex);
        
            $http.get($scope.url).
			    success(function (data, status, headers, config) {
			        //console.log(status);
			        $scope.$parent.loaderGifClass.display = "none";
			        $scope.loginButtonDisabled = false;
			        $rootScope.onlineLogin = true;
			        if (data.authenticated == true || data.authenticated == "true") {

			            console.log("user matched going online");
			            $scope.$storage.passWord = CryptoJS.AES.encrypt($scope.password, "telehealthcare").toString();
			            $scope.$storage.userName = $scope.username;
			            $scope.$storage.loginUrl = config.url;
			            $scope.buttonText = "LOGGED IN";
			            $scope.$storage.userID = data.usedID;
			            $state.go('patientSearch');
			        }
			        if (data.authenticated == false || data.authenticated == "false") {
			            $scope.newLoginMessage = {};
			            $scope.loginMessage = "Login failed. Invalid Username/Password.";
			            $scope.loginMessageStyleClass.color = "red";
			            $scope.loginMessageStyleClass["font-size"] = "100%";
			            //$rootScope.$broadcast('loginPage.onLoginFalied', { newloginMessage: $scope.newLoginMessage });
			        }

			    }).
			    error(function (data, status, headers, config) {
			        //console.log(status);
			        $scope.$parent.loaderGifClass.display = "none";
			        $scope.loginButtonDisabled = false;
			        $scope.newLoginMessage = {};
			        $scope.loginOffilne();
			        //$scope.loginMessage = "Login failed. Connection Error.";
			        //$scope.loginMessageStyleClass.color = "red";
			        //$rootScope.$broadcast('loginPage.onLoginFalied', { newloginMessage: $scope.newLoginMessage });
			    });
    }
}]);





//-------------------------------------------------------------

app.controller('patientSearchCtrl', function ($scope, $http, $location, $filter, $state, Idle, Keepalive, $rootScope, sqlCypherDb, $localStorage, urlHitService, dialogs, $stateParams, windowsFileDownload, $q, pdfSaver) {
    //$scope.date = new Date();
    //$scope.$watch("date", function (newValue, oldValue) {
    //console.log(newValue);
    //   console.log($scope);
    //}, true);
    /*pdfSaver.saveFileToDb("http://15.125.95.198/openemr/sites/phildemo/documents/1/Spirometer/20-03-2015_19.03.53_1.pdf", "20-03-2015_19.03.53_1.pdf").then(function (r) {
        console.log("saved");
    });*/
    //pdfSaver.fetchFile("20-03-2015_19.03.53_1.pdf");
    $scope.onlineLogin = $rootScope.onlineLogin;
    if (!$rootScope.patientSearchState) {
        $rootScope.patientSearchState = {
            currentScreen: "Patient Search",
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
            filterType: "id",
            appointmentsData: ($rootScope.appoinementData != undefined ? $rootScope.appoinementData : []),
            addPatientData: {
                countries: [],
                states: {},
                providers: [],
                pharmacies: [],
                language: [],
                referralSources: []
            }
        }
    }
    $scope.navAppear = true;

    $scope.status = { open: true };

    $scope.searchOptions = [
        {
            text: "Via patient Info",
            location: "Patient Search"
        },
        {
            text: "Via appointments",
            location: "Appointments"
        }

    ];
    $scope.onCreatePatient = function () {
        $scope.currentScreen = "Add Patient";
        $rootScope.patientSearchState.currentScreen = $scope.currentScreen;
        $scope.navAppear = !$scope.navAppear;
    }

    /*$scope.fileManager = {
        gotFS: function (fileSystem) {
            console.log("got filesystem", fileSystem.root.fullPath);

            // save the file system for later access
            console.log(fileSystem.root.fullPath);
            window.rootFS = fileSystem.root;
        },
        fail: function () {
            alert("failed");
            console.log("failed to get filesystem");
        },

        // Update DOM on a Received Event
        receivedEvent: function (url, fileName, location, p_patient, deocRecordVal) {
            var defered = $q.defer();
            if (device.platform === "windows") {
                windowsFileDownload.getFile(url, fileName, location).then(function (result) {
                    if (result.saved == true) {
                        defered.resolve({
                            url: "ms-appdata:///local/" + result.url,
                            patient: p_patient,
                            docRecVal: deocRecordVal
                        });
                    }
                })
            }
            else{
                window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, $scope.fileManager.gotFS, $scope.fileManager.fail);
                var fileTransfer = new FileTransfer();
                var uri = encodeURI(url);
                fileTransfer.download(uri,'cdvfile://localhost/persistent/path/to/downloads/pdfs/' + location + "/" + fileName,
                function (entry) {
                    console.log("download complete: " + entry.toURL());
                    defered.resolve({
                        url: "file:///" + entry.toURL(),
                        patient: p_patient,
                        docRecVal: deocRecordVal
                    });
                },
                function (error) {
                    console.log("download error source " + error.source);
                    console.log("download error target " + error.target);
                    console.log("upload error code" + error.code);
                },
                false,
                {
                    headers: {
                        "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                    }
                });
            }
            return defered.promise;
        }
    };*/
    //$scope.fileManager.receivedEvent('http://15.125.95.198/openemr/sites/phildemo/documents/1/Spirometer/20-03-2015_19.03.53_1.pdf','temp.pdf')

    $scope.deletePatientData = function () {
        $scope.navAppear = !$scope.navAppear;
        if (localStorage.getItem("ngStorage-lastDbSync")) {          
            localStorage.removeItem("ngStorage-lastDbSync");
            sqlCypherDb.deleteAllValuesFromTable("users").then(function (r) {
                console.log("user deleted");
            });
            sqlCypherDb.deleteAllValuesFromTable("appointments");
            sqlCypherDb.deleteAllValuesFromTable("patientDetails");
            sqlCypherDb.deleteAllValuesFromTable("pdfs");
        }
        else {
            console.log("no latest sync");
        }
    };
    $scope.syncData = function () {
        $scope.navAppear = !$scope.navAppear
        $scope.dialogInstance = dialogs.create('templates/dialogs/loadingDialog.html', 'loadingGifController', { message: "Syncing appointments . . ." },
        {
            'size': 'sm',
            'windowClass': 'align-modal-dialog'
        });
        sqlCypherDb.checkCypherKeyExists("telehealthcare").then(function (result) {
            console.log("database opened");
           
        });
        var today = new Date();
        urlHitService.hitUrl($rootScope.urls.dataSyncUrl + $filter('date')(today, 'MM-dd-yyyy') + "/" + $localStorage.userID).then(function (result) {
            //urlHitService.hitUrl("tempInout.json").then(function (result) {
            //console.log(result);
            $scope.dialogInstance.dismiss(null);
            if(result.data)
            {
                
                console.log("data returned")
                sqlCypherDb.deleteAllValuesFromTable('users').then(function (r1) {
                    sqlCypherDb.insertIntoTable('users', ['name', 'password'], [$localStorage.userName, $localStorage.passWord]).then(function (r) {
                        console.log("users added");
                    });
                });
                sqlCypherDb.deleteAllValuesFromTable('pdfs').then(function (r1) {

                });
                sqlCypherDb.deleteAllValuesFromTable('appointments').then(function (r1) {
                    console.log("appoinement deleted");
                    sqlCypherDb.deleteAllValuesFromTable('patientDetails').then(function (r2) {
                        console.log("patient deleted");
                        $rootScope.patientSearchState.appointmentsData = [];
                        $rootScope.allPatientDate = [];
                        var tempAppoinementArray = null;
                        var tempPatientDetails = null;
                        for(var i in result.data.syncObj.AppointmentSyncObjects)
                        {
                            console.log(result.data.syncObj.AppointmentSyncObjects[i]);
                            tempAppoinementArray={
                                "name": result.data.syncObj.AppointmentSyncObjects[i].mAppointment.patient.title + " " + result.data.syncObj.AppointmentSyncObjects[i].mAppointment.patient.firstName + " " + result.data.syncObj.AppointmentSyncObjects[i].mAppointment.patient.lastName,
                                "reason": result.data.syncObj.AppointmentSyncObjects[i].mAppointment.title,
                                "startTime": result.data.syncObj.AppointmentSyncObjects[i].mAppointment.scheduleStartTime,
                                "patientID": result.data.syncObj.AppointmentSyncObjects[i].mAppointment.patient.id
                            };
                            try {
                                tempPatientDetails = {
                                    patient: (result.data.syncObj.AppointmentSyncObjects[i].patientDetails ? result.data.syncObj.AppointmentSyncObjects[i].patientDetails : $stateParams.patientDetailsObject.patient),
                                    contact: (result.data.syncObj.AppointmentSyncObjects[i].contactDetails ? result.data.syncObj.AppointmentSyncObjects[i].contactDetails : $stateParams.patientDetailsObject.contact),
                                    notes: (result.data.syncObj.AppointmentSyncObjects[i].notes ? result.data.syncObj.AppointmentSyncObjects[i].notes : $stateParams.patientDetailsObject.notes),
                                    appoinments: [(result.data.syncObj.AppointmentSyncObjects[i].mAppointment ? result.data.syncObj.AppointmentSyncObjects[i].mAppointment : $stateParams.patientDetailsObject.appoinments)],
                                    choice: (result.data.syncObj.AppointmentSyncObjects[i].choice ? result.data.syncObj.AppointmentSyncObjects[i].choice : $stateParams.patientDetailsObject.choice),
                                    employer: (result.data.syncObj.AppointmentSyncObjects[i].employer ? result.data.syncObj.AppointmentSyncObjects[i].employer : $stateParams.patientDetailsObject.employer),
                                    stats: (result.data.syncObj.AppointmentSyncObjects[i].stats ? result.data.syncObj.AppointmentSyncObjects[i].stats : $stateParams.patientDetailsObject.stats),
                                    misc: (result.data.syncObj.AppointmentSyncObjects[i].misc ? result.data.syncObj.AppointmentSyncObjects[i].misc : $stateParams.patientDetailsObject.misc),
                                    documents: (result.data.syncObj.AppointmentSyncObjects[i].documents ? result.data.syncObj.AppointmentSyncObjects[i].documents : $stateParams.patientDetailsObject.documents),
                                    medicalHistory: {
                                        allergies: (result.data.syncObj.AppointmentSyncObjects[i].allergies ? result.data.syncObj.AppointmentSyncObjects[i].allergies : $stateParams.patientDetailsObject.medicalHistory.allergies),
                                        medication: (result.data.syncObj.AppointmentSyncObjects[i].medication ? result.data.syncObj.AppointmentSyncObjects[i].medication : $stateParams.patientDetailsObject.medicalHistory.medication),
                                        medicalProblems: (result.data.syncObj.AppointmentSyncObjects[i].medicalIssues ? result.data.syncObj.AppointmentSyncObjects[i].medicalIssues : $stateParams.patientDetailsObject.medicalHistory.medicalProblems),
                                        immunization: (result.data.syncObj.AppointmentSyncObjects[i].immunuzations ? result.data.syncObj.AppointmentSyncObjects[i].immunuzations : $stateParams.patientDetailsObject.medicalHistory.immunization),
                                        prescriptions: (result.data.syncObj.AppointmentSyncObjects[i].prescriptions ? result.data.syncObj.AppointmentSyncObjects[i].prescriptions : $stateParams.patientDetailsObject.medicalHistory.prescriptions),
                                        surgeries: (result.data.syncObj.AppointmentSyncObjects[i].surgeries ? result.data.syncObj.AppointmentSyncObjects[i].surgeries : $stateParams.patientDetailsObject.medicalHistory.surgeries),
                                        dentalIssues: (result.data.syncObj.AppointmentSyncObjects[i].dentals ? result.data.syncObj.AppointmentSyncObjects[i].dentals : $stateParams.patientDetailsObject.medicalHistory.dentalIssues)
                                    },
                                    historyData: {
                                        familyHistory: (result.data.syncObj.AppointmentSyncObjects[i].familyHistory ? { familyHistory: result.data.syncObj.AppointmentSyncObjects[i].familyHistory } : $stateParams.patientDetailsObject.historyData.familyHistory),
                                        general: (result.data.syncObj.AppointmentSyncObjects[i].generalHistory ? { generalHistory: result.data.syncObj.AppointmentSyncObjects[i].generalHistory } : $stateParams.patientDetailsObject.historyData.general),
                                        lifestyle: (result.data.syncObj.AppointmentSyncObjects[i].lifestyleHistory ? { lifestyleHistory: result.data.syncObj.AppointmentSyncObjects[i].lifestyleHistory } : $stateParams.patientDetailsObject.historyData.lifestyle),
                                        other: (result.data.syncObj.AppointmentSyncObjects[i].otherHistory ? { familyHistory: result.data.syncObj.AppointmentSyncObjects[i].otherHistory } : $stateParams.patientDetailsObject.historyData.other),
                                        relatives: (result.data.syncObj.AppointmentSyncObjects[i].relativeHistory ? { relativeHistory: result.data.syncObj.AppointmentSyncObjects[i].relativeHistory } : $stateParams.patientDetailsObject.historyData.relatives)
                                    },
                                    transactions: (result.data.syncObj.AppointmentSyncObjects[i].transactions ? result.data.syncObj.AppointmentSyncObjects[i].transactions : []),
                                    mainTabState: 0,
                                    piTabState: 0,
                                    issuesTabState: 0,
                                    homeTabState: 0,
                                    historyTabState: 0,
                                    disclosures: [],
                                    encounterData: [],
                                    encounterValues: {},
                                    encounters: {},
                                    latestVitals: result.data.syncObj.AppointmentSyncObjects[i].vitals[0],
                                    vitalsData: {
                                        BM: null,
                                        BP: null,
                                        HC: null,
                                        HR: null,
                                        HT: null,
                                        RP: null,
                                        TP: null,
                                        WC: null,
                                        WT: null,
                                        os: null
                                    }
                                };
                            }
                            catch(e)
                            {

                            }
                            
                            if (result.data.syncObj.AppointmentSyncObjects[i].vitals)
                            {
                                tempPatientDetails.vitalsData = {
                                    BM: {
                                        data: [],
                                        patientID: 1,
                                        type: "BMI"
                                    },
                                    BP: {
                                        data: [],
                                        patientID: 1,
                                        type: "Blood Pressure"
                                    },
                                    HC: {
                                        data: [],
                                        patientID: 1,
                                        type: "Head Circumference"
                                    },
                                    HR: {
                                        data: [],
                                        patientID: 1,
                                        type: "Pulse"
                                    },
                                    HT: {
                                        data: [],
                                        patientID: 1,
                                        type: "Height"
                                    },
                                    RP: {
                                        data: [],
                                        patientID: 1,
                                        type: "Respiration"
                                    },
                                    TP: {
                                        data: [],
                                        patientID: 1,
                                        type: "Temperature"
                                    },
                                    WC: {
                                        data: [],
                                        patientID: 1,
                                        type: "Waist"
                                    },
                                    WT: {
                                        data: [],
                                        patientID: 1,
                                        type: "Weight"
                                    },
                                    os: {
                                        data: [],
                                        patientID: 1,
                                        type: "Oxygen Saturation"
                                    }
                                }
                                for (var j in result.data.syncObj.AppointmentSyncObjects[i].vitals) {
                                    tempPatientDetails.vitalsData.BM.data.push({ date: result.data.syncObj.AppointmentSyncObjects[i].vitals[j].date, value: result.data.syncObj.AppointmentSyncObjects[i].vitals[j].bmi });
                                    tempPatientDetails.vitalsData.HC.data.push({ date: result.data.syncObj.AppointmentSyncObjects[i].vitals[j].date, value: result.data.syncObj.AppointmentSyncObjects[i].vitals[j].headCirculation });
                                    tempPatientDetails.vitalsData.HR.data.push({ date: result.data.syncObj.AppointmentSyncObjects[i].vitals[j].date, value: result.data.syncObj.AppointmentSyncObjects[i].vitals[j].pulse });
                                    tempPatientDetails.vitalsData.HT.data.push({ date: result.data.syncObj.AppointmentSyncObjects[i].vitals[j].date, value: result.data.syncObj.AppointmentSyncObjects[i].vitals[j].height });
                                    tempPatientDetails.vitalsData.RP.data.push({ date: result.data.syncObj.AppointmentSyncObjects[i].vitals[j].date, value: result.data.syncObj.AppointmentSyncObjects[i].vitals[j].respiration });
                                    tempPatientDetails.vitalsData.TP.data.push({ date: result.data.syncObj.AppointmentSyncObjects[i].vitals[j].date, value: result.data.syncObj.AppointmentSyncObjects[i].vitals[j].temperature });
                                    tempPatientDetails.vitalsData.WC.data.push({ date: result.data.syncObj.AppointmentSyncObjects[i].vitals[j].date, value: result.data.syncObj.AppointmentSyncObjects[i].vitals[j].waistCirculation });
                                    tempPatientDetails.vitalsData.WT.data.push({ date: result.data.syncObj.AppointmentSyncObjects[i].vitals[j].date, value: result.data.syncObj.AppointmentSyncObjects[i].vitals[j].weight });
                                    tempPatientDetails.vitalsData.os.data.push({ date: result.data.syncObj.AppointmentSyncObjects[i].vitals[j].date, value: result.data.syncObj.AppointmentSyncObjects[i].vitals[j].oxygenSaturaton });
                                    tempPatientDetails.vitalsData.BP.data.push({ date: result.data.syncObj.AppointmentSyncObjects[i].vitals[j].date, bps: result.data.syncObj.AppointmentSyncObjects[i].vitals[j].bps, bpd: result.data.syncObj.AppointmentSyncObjects[i].vitals[j].bpd});                                    
                                }
                            }
                            if (result.data.syncObj.AppointmentSyncObjects[i].disclosures)
                                for (var j in result.data.syncObj.AppointmentSyncObjects[i].disclosures)
                                {
                                    tempPatientDetails.disclosures.push({
                                        "description": result.data.syncObj.AppointmentSyncObjects[i].disclosures[j].description,
                                        "disclosureType": result.data.syncObj.AppointmentSyncObjects[i].disclosures[j].disclosure,
                                        "recepientName": result.data.syncObj.AppointmentSyncObjects[i].disclosures[j].recipient,
                                    });
                                }
                            if (result.data.syncObj.AppointmentSyncObjects[i].encounters)
                                for (var j in result.data.syncObj.AppointmentSyncObjects[i].encounters) {
                                    tempPatientDetails.encounterData.push({
                                        "date": result.data.syncObj.AppointmentSyncObjects[i].encounters[j].date,
                                        "display": result.data.syncObj.AppointmentSyncObjects[i].encounters[j].display,
                                        "encounterID": result.data.syncObj.AppointmentSyncObjects[i].encounters[j].encounterID,
                                        "id": result.data.syncObj.AppointmentSyncObjects[i].encounters[j].id,
                                        "visitCategory": result.data.syncObj.AppointmentSyncObjects[i].encounters[j].visitCategory,
                                    });
                                    if (tempPatientDetails.encounterValues[result.data.syncObj.AppointmentSyncObjects[i].encounters[j].encounterID] == undefined)
                                        tempPatientDetails.encounterValues[result.data.syncObj.AppointmentSyncObjects[i].encounters[j].encounterID] = {};
                                    //console.log(result.data.syncObj.AppointmentSyncObjects[i].encounters[j].mEncounters);
                                    for(var k in  result.data.syncObj.AppointmentSyncObjects[i].encounters[j].mEncounters)
                                    {
                                        if (result.data.syncObj.AppointmentSyncObjects[i].encounters[j].mEncounters[k].type != undefined)
                                        {
                                            if(tempPatientDetails.encounterValues[result.data.syncObj.AppointmentSyncObjects[i].encounters[j].encounterID][result.data.syncObj.AppointmentSyncObjects[i].encounters[j].mEncounters[k].type] == undefined)
                                            {
                                                tempPatientDetails.encounterValues[result.data.syncObj.AppointmentSyncObjects[i].encounters[j].encounterID][result.data.syncObj.AppointmentSyncObjects[i].encounters[j].mEncounters[k].type] = [];
                                            }
                                            tempPatientDetails.encounterValues[result.data.syncObj.AppointmentSyncObjects[i].encounters[j].encounterID][result.data.syncObj.AppointmentSyncObjects[i].encounters[j].mEncounters[k].type].push(result.data.syncObj.AppointmentSyncObjects[i].encounters[j].mEncounters[k]);
                                        }
                                    }
                      
                                }
                            if (tempPatientDetails.medicalHistory.allergies)
                                for (var j in tempPatientDetails.medicalHistory.allergies)
                                {
                                    if(tempPatientDetails.encounters[tempPatientDetails.medicalHistory.allergies[j].allergyName] == undefined){
                                        tempPatientDetails.encounters[tempPatientDetails.medicalHistory.allergies[j].allergyName] = "null";
                                    }
                                }
                            if (tempPatientDetails.medicalHistory.medicalProblems)
                                for (var j in tempPatientDetails.medicalHistory.medicalProblems) {
                                    if (tempPatientDetails.encounters[tempPatientDetails.medicalHistory.medicalProblems[j].medicalIssueName] == undefined) {
                                        tempPatientDetails.encounters[tempPatientDetails.medicalHistory.medicalProblems[j].medicalIssueName] = "null";
                                    }
                                }
                            if (tempPatientDetails.medicalHistory.medication)
                                for (var j in tempPatientDetails.medicalHistory.medication) {
                                    if (tempPatientDetails.encounters[tempPatientDetails.medicalHistory.medication[j].medicationName] == undefined) {
                                        tempPatientDetails.encounters[tempPatientDetails.medicalHistory.medication[j].medicationName] = "null";
                                    }

                                }
                            if (tempPatientDetails.medicalHistory.surgeries)
                                for (var j in tempPatientDetails.medicalHistory.surgeries) {
                                    if (tempPatientDetails.encounters[tempPatientDetails.medicalHistory.surgeries[j].surgeryName] == undefined) {
                                        tempPatientDetails.encounters[tempPatientDetails.medicalHistory.surgeries[j].surgeryName] = "null";
                                    }

                                }
                            if (tempPatientDetails.medicalHistory.dentalIssues)
                                for (var j in tempPatientDetails.medicalHistory.dentalIssues) {
                                    if (tempPatientDetails.encounters[tempPatientDetails.medicalHistory.dentalIssues[j].dentalName] == undefined) {
                                        tempPatientDetails.encounters[tempPatientDetails.medicalHistory.dentalIssues[j].dentalName] = "null";
                                    }

                                }
                            tempPatientDetails.patient.patientImageURL = null;
                            //console.log(JSON.stringify(tempAppoinementArray));
                            console.log(tempPatientDetails);
                            $rootScope.patientSearchState.appointmentsData.push(tempAppoinementArray);
                            $rootScope.allPatientDate.push(tempPatientDetails);
                            /*sqlCypherDb.deleteAllValuesFromTable('appointments').then(function (result) {
                                sqlCypherDb.deleteAllValuesFromTable('patientDetails').then(function (result) {
                                })
                            })*/
                            sqlCypherDb.insertIntoTable('appointments', ['appointmentData'], [JSON.stringify(tempAppoinementArray)]).then(function (result) {
                                console.log("appointment added");
                            });
                            /*sqlCypherDb.insertIntoTable('patientDetails', ['patientID', 'patientDetailsData'], [tempPatientDetails.patient.id , JSON.stringify(tempPatientDetails)]).then(function (result) {
                                console.log("details added");
                            });*/
                            for (var j in tempPatientDetails.documents) {
                                /*$scope.fileManager.receivedEvent(tempPatientDetails.documents[j].documentURL, tempPatientDetails.documents[j].documentName, "id_" + tempPatientDetails.patient.id, JSON.stringify(tempPatientDetails), j).then(function (urlRes) {
                                    var tempPatient = JSON.parse(urlRes.patient);
                                    tempPatient.documents[urlRes.docRecVal].documentURL = urlRes.url;
                                    sqlCypherDb.updateTable('patientDetails', 'patientDetailsData', JSON.stringify(tempPatient), "patientID", tempPatient.patient.id).then(function (updateRed) {
                                        console.log("Download url updated");
                                    });
                                    
                                });*/
                                
                                pdfSaver.saveFileToDb(tempPatientDetails.documents[j].documentURL, tempPatientDetails.documents[j].documentName).then(function (r) {
                                    
                                    console.log(tempPatientDetails.documents[j].documentName + " Downloaded and saved");
                                });
                                tempPatientDetails.documents[j].documentURL = tempPatientDetails.documents[j].documentName;
                            }
                            sqlCypherDb.insertIntoTable('patientDetails', ['patientID', 'dob', 'gender', 'name', 'patientDetailsData'], [tempPatientDetails.patient.id, $filter('date')(new Date(tempPatientDetails.patient.dob), "MM-dd-yyyy"), tempPatientDetails.patient.gender, tempPatientDetails.patient.firstName, JSON.stringify(tempPatientDetails)]).then(function (result) {
                                console.log("details added");
                            });
                        }
                    });
                });
                //$rootScope.patientSearchState.appointmentsData

            }
            else
            {
                delete $localStorage.lastDbSync;
                localStorage.removeItem("ngStorage-lastDbSync");
            }
        })
        /*sqlCypherDb.checkCypherKeyExists("telehealthcare").then(function (result) {
            sqlCypherDb.insertIntoTable('users', ['name', 'password'], [$localStorage.userName, $localStorage.passWord]).then(function (result) {
            });
        });*/
    }
    $scope.currentScreen = $rootScope.patientSearchState.currentScreen;
    $scope.onNavBarButtonsClicked = function (location) {
        $scope.currentScreen = location.location;
        $rootScope.patientSearchState.currentScreen = $scope.currentScreen;
        $scope.navAppear = !$scope.navAppear;
    }

    $scope.hardwareBackButtonClicked = function () {
        //console.log("in patient Search controller");

        $scope.logoutClicked();
    }
    //console.log($localStorage.loginUrl);
    $scope.loaderGifClass = { "display": "none" };


    $scope.logoutUrl = $rootScope.urls.logoutUrl;
    $scope.logoutClicked = function () {
        $http.get($scope.logoutUrl).
           success(function (data, status, headers, config) {
               //if (data.userLoggedOut == true || data.userLoggedOut == "true")

           }).
           error(function (data, status, headers, config) {
               //console.log("logged Out error");

               //console.log(config.url);
           });
        $state.go('login');
    }

    $scope.$on('IdleStart', function () {
        console.log("idle start");
    });

    $scope.$on('IdleEnd', function () {
        console.log("idle End");
    });

    $scope.$on('IdleTimeout', function () {
        $scope.logoutUrl = $rootScope.urls.logoutUrl;
        $http.get($scope.logoutUrl).
            success(function (data, status, headers, config) {
                console.log("logged Out");
                $state.go('login');
            }).
            error(function (data, status, headers, config) {
                console.log("logged Out error");
                $state.go('login');
            });

    });

    $scope.start = function () {
        Idle.watch();
        $scope.started = true;
    };

    $scope.stop = function () {
        Idle.unwatch();
        $scope.started = false;

    };

    $scope.start();
});

app.controller('selectPatientCtrl', ['$scope', '$http', '$element', '$rootScope', '$state', '$localStorage', 'dialogs', '$stateParams', 'sqlCypherDb', '$filter', function ($scope, $http, $element, $rootScope, $state, $localStorage, dialogs, $stateParams, sqlCypherDb, $filter) {
    $scope.searchDesabled = false;
    $scope.keyDownEvent = function (e) {
        if (e.keyCode == 13) {

            $scope.onSearchClicked();
        }
    }



    $scope.filterName = "Filter patients by patientID (Enter a number):";
    $scope.filterType = $rootScope.patientSearchState.filterType;
    $scope.patientSearchIdStyleClass = { "background-color": "#2A4455" };
    $scope.patientSearchNameStyleClass = { "background-color": "#4D687B" };
    $scope.patientSearchGenderStyleClass = { "background-color": "#4D687B" };
    $scope.patientSearchDOBStyleClass = { "background-color": "#4D687B" };
    $scope.selectedHeader = { 'path': "templates/directives/patientSearchPage/filterType-textBox.html" };


    //$scope.patients = [];
    $scope.patients = $stateParams.patientListData.data;
    $scope.genderType = ["Male", "Female"];

    $scope.patientsLoadedInfo = $rootScope.patientSearchState.statusText;
    $scope.dataToBeLoaded = $rootScope.patientSearchState.dataToBeLoaded;
    $scope.dataLoaded = $rootScope.patientSearchState.dataLoaded;
    $scope.setNumber = $rootScope.patientSearchState.setNumber;
    $scope.patient = $rootScope.patientSearchState.patient;
    if ((typeof $scope.patient.dob) != "string") {
        $scope.patient.dob = $filter('date')($scope.patient.dob, "MM-dd-yyyy")
    }

    $scope.dateSelected = {
        date: new Date(),
    };
    $scope.textTypeSpec = "number";

    $scope.setCachedData = function () {
        $scope.onFilterTypeClicked($rootScope.patientSearchState.tabSelection);
    }
    $scope.offlinePatientsList = [];
    $scope.onFilterTypeClicked = function (filter) {
        //console.log($element[0].style);
        $rootScope.$broadcast('patientSearchPage.filterTypeChanged');
        $scope.patientSearchIdStyleClass = { "background-color": "#4D687B" };
        $scope.patientSearchNameStyleClass = { "background-color": "#4D687B" };
        $scope.patientSearchGenderStyleClass = { "background-color": "#4D687B" };
        $scope.patientSearchDOBStyleClass = { "background-color": "#4D687B" };

        if (filter == "id") {
            $scope.patientSearchIdStyleClass = { "background-color": "#2A4455" };
            $scope.textTypeSpec = "number";
            $scope.filterName = "Filter patients by patientID (Enter a number): ";
            if ($scope.filterType != "id") {
                $scope.patients = [];
            }
            $scope.filterType = "id";
            $scope.selectedHeader.path = "templates/directives/patientSearchPage/filterType-textBox.html";

        }
        else if (filter == "name") {

            $scope.patientSearchNameStyleClass = { "background-color": "#2A4455" };
            $scope.textTypeSpec = "text";
            $scope.filterName = "Filter patients by name (Enter an alphabet):";
            if ($scope.filterType != "name") {
                $scope.patients = [];
            }
            $scope.filterType = "name";
            $scope.selectedHeader.path = "templates/directives/patientSearchPage/filterType-textBox.html";
        }
        else if (filter == "gender") {

            $scope.patientSearchGenderStyleClass = { "background-color": "#2A4455" };
            $scope.filterName = "Filter patients by gender";
            if ($scope.filterType != "gender") {
                $scope.patients = [];
            }
            $scope.filterType = "gender";

            $scope.selectedHeader.path = "templates/directives/patientSearchPage/filterType-dropDown.html";
        }
        else if (filter == "dob") {
            //console.log(filter);
            $scope.patientSearchDOBStyleClass = { "background-color": "#2A4455" };
            $scope.filterName = "Filter patients by date of birth";
            if ($scope.filterType != "dob") {
                $scope.patients = [];
            }
            $scope.filterType = "dob";
            $scope.selectedHeader.path = "templates/directives/patientSearchPage/filterType-datePicker.html";
        }
        $rootScope.patientSearchState.filterType = $scope.filterType;
    }

    $scope.getOfflineData = function () {
        console.log($scope.patient);
        function onResutlFromDBReturned(result) {
            $scope.patients = [];
            $scope.offlinePatientsList = [];
            $scope.patientsLoadedInfo = "Patinet list";
            $scope.dataLoaded = 1;
            $scope.dataToBeLoaded = 1;
            for (var i = 0 ; i < result.length; i++) {
                console.log(result.item(i));
                var tempPatient = JSON.parse(result.item(i).patientDetailsData);
                $scope.offlinePatientsList.push(tempPatient);
                $scope.patients.push({
                    name: tempPatient.patient.firstName + " " + tempPatient.patient.lastName,
                    gender: tempPatient.patient.gender,
                    dateOfBirth: tempPatient.patient.dob,
                    patientID: tempPatient.patient.id

                });
            }
        }
        if ($scope.filterType == "id") {
            sqlCypherDb.selectFromTable("patientDetails", "*", "id = " + $scope.patient.filterText).then(onResutlFromDBReturned);
        }
        else if ($scope.filterType == "name") {
            //$scope.urlType = $rootScope.urls.patientNameSearchUrl + $scope.patient.filterText + "/0/20";
            sqlCypherDb.selectFromTable("patientDetails", "*", "name LIKE \"" + $scope.patient.filterText + "\"").then(onResutlFromDBReturned);
        }
        else if ($scope.filterType == "gender") {
            //$scope.urlType = $rootScope.urls.patientGenderSearchUrl + $scope.patient.gender + "/0/20";
            sqlCypherDb.selectFromTable("patientDetails", "*", "gender = \"" + $scope.patient.gender + "\"").then(onResutlFromDBReturned);
        }
        else if ($scope.filterType == "dob") {
            sqlCypherDb.selectFromTable("patientDetails", "*", "dob = \"" + $scope.patient.dob + "\"").then(onResutlFromDBReturned);
        }
    }


    $scope.onSearchClicked = function () {
        if (!$rootScope.onlineLogin || $localStorage.lastDbSync) {
            $scope.getOfflineData();
        }
        else
        {
            $scope.searchDesabled = true;
            $scope.patients = [];
            $scope.getPatientsList();
        }
    }


    $scope.getPatientsList = function () {
        //console.log($scope.patient.dob);
        $scope.$parent.loaderGifClass.display = "block";
        if ($scope.filterType == "id") {
            $scope.urlType = $rootScope.urls.patientIdSearchUrl + $scope.patient.filterText;
        }
        else if ($scope.filterType == "name") {
            $scope.urlType = $rootScope.urls.patientNameSearchUrl + $scope.patient.filterText + "/0/20";
        }
        else if ($scope.filterType == "gender") {
            $scope.urlType = $rootScope.urls.patientGenderSearchUrl + $scope.patient.gender + "/0/20";
        }
        else if ($scope.filterType == "dob") {
            $scope.urlType = $rootScope.urls.patientDateSearchUrl + $scope.patient.dob + "/0/20";
        }
        //console.log($scope.urlType);

        $scope.patientSearchSuccessfull = function (data, status, headers, config) {
            $scope.searchDesabled = false;
            if ($scope.filterType == "id") {
                if (data.patient) {
                    $scope.patientsLoadedInfo = "Found user id " + $scope.patient.filterText;
                    $scope.patients.push({
                        name: data.patient.firstName + " " + data.patient.lastName,
                        gender: data.patient.gender,
                        dateOfBirth: data.patient.dob,
                        patientID: data.patient.id

                    });
                    $stateParams.patientListData.data = $scope.patients;
                    $scope.dataToBeLoaded = 1;
                }
                else {
                    $scope.patientsLoadedInfo = "No user found";
                }
            }
            else {
                //console.log(data.searchResult.patientAmount);

                for (var i = 0; i < data.searchResult.patients.length; i++) {
                    $scope.patients.push({
                        name: data.searchResult.patients[i].firstName + " " + data.searchResult.patients[i].lastName,
                        gender: data.searchResult.patients[i].gender,
                        dateOfBirth: data.searchResult.patients[i].dob,
                        patientID: data.searchResult.patients[i].id
                    });
                }
                $scope.dataToBeLoaded = data.searchResult.patientAmount;
                $scope.setNumber = 1;
                $scope.patientsLoadedInfo = $scope.patients.length
                    + " of " + data.searchResult.patientAmount;
            }
            $scope.$parent.loaderGifClass.display = "none";
            $scope.dataLoaded = $scope.patients.length;
            //console.log($scope.dataLoaded);
        }

        $scope.patientSearchError = function (data, status, headers, config) {
            //console.log(status);
            $scope.searchDesabled = false;
            $scope.urlRefesh = config.url;
            if (status == 401) {
                //console.log($localStorage.loginUrl);
                $http.get($localStorage.loginUrl).
                success(function (data, status, headers, config) {
                    //console.log($scope.urlRefesh);
                    $http.get($scope.urlRefesh).
                        success($scope.patientSearchSuccessfull).
                        error($scope.patientSearchError);
                }
                ).
                error(
                function (data, status, headers, config) {
                    delete $localStorage.loginUrl;
                    if (!$scope.dlg1) {
                        $scope.dlg1 = dialogs.error('Connecton expired!', ' You will be logged out!');
                        $scope.dlg1.result.then(function (btn) {
                            $scope.dlg1 = null;
                            $state.go('login');

                        });
                    }

                }
                );
            }
            else {
                //$scope.patientsLoadedInfo = "Error reaching server. Please check your internet connection.";
                $scope.$parent.loaderGifClass.display = "none";
                delete $localStorage.loginUrl;
                if (!$scope.dlg1) {
                    $scope.dlg1 = dialogs.error('Unknown error when connecting to the server!', "There seems to be problem with your internet connection!\nCheck you connection and try again!");
                    $scope.dlg1.result.then(function (btn) {
                        //$state.go('login');
                        $scope.dlg1 = null;
                    });
                }
            }
        }
        $http.get($scope.urlType).
            success($scope.patientSearchSuccessfull).
            error($scope.patientSearchError);
    }
    $scope.genderSeleteionChanged = function (choice)          //attaching a method "genderSeleteionChanged" to $scope object which is called from template/view
    {
        $scope.patient.gender = choice;
    }

    $scope.scrolled = function (event, isEndEvent) {
        /*console.log(event.target.scrollHeight);
        console.log(event.target.offsetHeight);*/
        //console.log(event.target.scrollTop + event.target.offsetHeight - event.target.scrollHeight);
        if (event.target.scrollTop + event.target.offsetHeight - event.target.scrollHeight >= -2 && event.target.scrollTop + event.target.offsetHeight - event.target.scrollHeight <= 2) {
            //console.log("end of scroll:" + $scope.filterType);

            if ($scope.dataLoaded < $scope.dataToBeLoaded) {
                $scope.$parent.loaderGifClass.display = "block";

                if ($scope.filterType == "name") {
                    $scope.urlType = $rootScope.urls.patientNameSearchUrl + $scope.patient.filterText + "/" + $scope.setNumber + "/20";
                }
                else if ($scope.filterType == "gender") {
                    $scope.urlType = $rootScope.urls.patientGenderSearchUrl + $scope.patient.gender + "/" + $scope.setNumber + "/20";
                }
                else if ($scope.filterType == "dob") {
                    $scope.urlType = $rootScope.urls.patientDateSearchUrl + $scope.patient.dob + "/" + $scope.setNumber + "/20";
                }
                //console.log($scope.urlType);
                $scope.lazyLoadSucessFull = function (data, status, headers, config) {
                    for (var i = 0; i < data.searchResult.patients.length; i++) {
                        $scope.patients.push({

                            name: data.searchResult.patients[i].firstName + " " + data.searchResult.patients[i].lastName,
                            gender: data.searchResult.patients[i].gender,
                            dateOfBirth: data.searchResult.patients[i].dob,
                            patientID: data.searchResult.patients[i].id
                        });
                    }
                    $scope.setNumber++;
                    $scope.dataLoaded = $scope.patients.length;
                    $scope.patientsLoadedInfo = $scope.dataLoaded + " of " + data.searchResult.patientAmount;
                    $scope.$parent.loaderGifClass.display = "none";
                }
                $scope.lazyLoadFailed = function (data, status, headers, config) {
                    $scope.urlRefesh = config.url;
                    if (status == 401) {
                        //console.log($localStorage.loginUrl);
                        $http.get($localStorage.loginUrl).
                        success(function (data, status, headers, config) {
                            //console.log($scope.urlRefesh);
                            $http.get($scope.urlRefesh).
                                success($scope.lazyLoadSucessFull).
                                error($scope.lazyLoadFailed);
                        }).
                        error(
                        function (data, status, headers, config) {
                            delete $localStorage.loginUrl;
                            if (!$scope.dlg) {
                                $scope.dlg = dialogs.error('Connecton expired!', ' You will be logged out!');
                                $scope.dlg.result.then(function (btn) {
                                    $scope.dlg = null;
                                    $state.go('login');

                                });
                            }

                        }
                        );
                    }
                    else {
                        //$scope.patientsLoadedInfo = "Error reaching server. Please check your internet connection.";
                        $scope.$parent.loaderGifClass.display = "none";
                        delete $localStorage.loginUrl;
                        if (!$scope.dlg) {
                            $scope.dlg = dialogs.error('Unknown error when connecting to the server!', "There seems to be problem with your internet connection!\nCheck you connection and try again!");
                            $scope.dlg.result.then(function (btn) {
                                //$state.go('login');
                                $scope.dlg = null;
                            });
                        }
                    }
                }

                $http.get($scope.urlType).
                    success($scope.lazyLoadSucessFull).
                     error($scope.lazyLoadFailed);
            }
        }

    }

    $scope.patientSelected = $stateParams.patientDetailsObject;
    $scope.onPatientClicker = function (patientClicker) {
        //console.log(patientClicker.patientID);
        $scope.patientSelected.patientID = patientClicker.patientID;
        //console.log("patient Clicked");
        //$scope.$parent.loaderGifClass.display = "block";
        $scope.patientInfoSet = false;
        $scope.contactInfoSet = false;
        $scope.choiceInfoSet = true;
        $scope.employerInfoSet = true;
        $scope.miscInfoSet = true;
        $scope.notesInfoSet = false;

        $rootScope.patientDetailsToBeDisplayed = $scope.patientSelected;
        
        $rootScope.patientSearchState.tabSelection = $scope.filterType;
        $rootScope.patientSearchState.setNumber = $scope.setNumber;
        $rootScope.patientSearchState.dataLoaded = $scope.dataLoaded;
        $rootScope.patientSearchState.dataToBeLoaded = $scope.dataToBeLoaded;
        $rootScope.patientSearchState.statusText = $scope.patientsLoadedInfo;
        $rootScope.patientSearchState.patient = $scope.patient;
        if (!$rootScope.onlineLogin || $localStorage.lastDbSync) {
            
            for (var i in $scope.offlinePatientsList) {
                if (patientClicker.patientID == $scope.offlinePatientsList[i].patient.id) {
                    //console.log(patientClicker.patientID)
                    
                    $rootScope.patientDetailsToBeDisplayed = $scope.offlinePatientsList[i];
                    $rootScope.patientDetailsToBeDisplayed.id = $rootScope.patientDetailsToBeDisplayed.patient.id;
                    //console.log($rootScope.patientDetailsToBeDisplayed);
                    $state.go('patientDetails', {
                        patientListData: {
                            data: $scope.patients,
                            dataApointments: []
                        },
                        patientDetailsObject: $rootScope.patientDetailsToBeDisplayed
                    });
                    break;
                }
            }
        }
        else
        {
            $state.go('patientDetails', {
                patientListData: {
                    data: $scope.patients,
                    dataApointments: []
                },
                patientDetailsObject: $scope.patientSelected
            });
        }
    }
    $scope.setCachedData();
}]);

app.controller('modalUploadVitalsController', ['$scope', '$modalInstance', '$http', '$filter', 'data', '$rootScope', function ($scope, $modalInstance, $http, $filter, data, $rootScope) {
    $scope.type = "danger";
    $scope.measurementUnits = {
        headCircumference: 'in',
        weight: 'lbs',
        height: 'in',
        waistCircumference: 'in',
        temperature: 'F', 
        oxygenSaturation: '%',
        pulse: 'per min',
        bps: 'mmHg',
        bpd: 'mmHg',
        painScore:'',
        respiration: 'per min',
        bmi: 'Kg/m^2',
        glucoseMmol:'mmol/L'


    }
    $scope.earlyWarning = 0;
    $scope.tempUnitType = ["F", "C"];
    $scope.lengthUnits = ["in", "cm"];
    $scope.weightUnitType = ["lbs", "kg"];
    $scope.unitTypeChanged = function(unit, type)
    {
        $scope.measurementUnits[type] = unit;
    }
    $scope.closeDialog = function () {
        $modalInstance.dismiss();
    }
   

    $scope.vitalsData = {
        "temperature": undefined,
        "oxygenSaturation": undefined,
        "pulse": undefined,
        "bps": undefined,
        "bpd": undefined,
        "date": new Date(),
        "height": undefined,
        "weight": undefined,
        "respiration": undefined,
        "waistCircumference": undefined,
        "headCircumference": undefined,
        "bmi": undefined,
        "urineOutput": undefined,
        "escalationPlan": undefined,
        "monitoringFrequency": undefined,
        "inspiredO2Per": undefined,
        "glucoseMmol": undefined,
        "consciousness": undefined,
        "painScore":undefined

    }
    $scope.$watch('vitalsData', function (newValue, oldVAlue) {
        var tempcurrent = 0;
        
        for (i in newValue) {

            if (newValue[i] != "" && newValue[i] != undefined) {
                tempcurrent++;
            }

        }
        //console.log(tempcurrent);
        $scope.progressBarSpecs.current = tempcurrent;
        $scope.calculateEWS();
    }, true);
    $scope.progressBarSpecs = {
        max: 13,
        current: 5
    }

    $scope.calculateEWS = function () {
        var latestVitals = $scope.vitalsData;
        $scope.earlyWarning = 0;
        var ews = { "bps": 0, "respiration": 0, "pulse": 0, "temperature": 0, "consciousness": 0 };
        if (latestVitals["bps"] != undefined && latestVitals["bps"] != "") {
            if (latestVitals["bps"] <= 60.5 && latestVitals["bps"] >=159.5)
                ews["bps"] = 3;
            else if ((latestVitals["bps"] > 60.5 && latestVitals["bps"] <= 77 )||(latestVitals["bps"] >= 143 && latestVitals["bps"] < 159.5))
                ews["bps"] = 2;
            else if ((latestVitals["bps"] > 77 && latestVitals["bps"] <= 93.5) || (latestVitals["bps"] >=126.5 && latestVitals["bps"] < 143))
                ews["bps"] = 1;
            else if (latestVitals["bps"]>93.5 && latestVitals["bps"]<126.5)
                ews["bps"] = 0;

        }

        if (latestVitals["pulse"] != undefined && latestVitals["pulse"] != "") {
            if (latestVitals["pulse"] >= 130)
                ews["pulse"] = 3;
            else if ((latestVitals["pulse"] <= 40) || ((latestVitals["pulse"] >= 111) && (latestVitals["pulse"] <= 129)))
                ews["pulse"] = 2;
            else if (((latestVitals["pulse"] >= 41) && (latestVitals["pulse"] <= 50)) || ((latestVitals["pulse"] >= 101) && (latestVitals["pulse"] <= 110)))
                ews["pulse"] = 1;
            else if (latestVitals["pulse"] >= 51 && latestVitals["pulse"] <= 100)
                ews["pulse"] = 0;
        }
        if (latestVitals["respiration"] != undefined && latestVitals["respiration"] != "") {
            if (latestVitals["respiration"] >= 30)
                ews["respiration"] = 3;
            else if (latestVitals["respiration"] < 9 || ((latestVitals["respiration"] >= 21) && (latestVitals["respiration"] <= 29)))
                ews["respiration"] = 2;
            else if (latestVitals["respiration"] >= 15 && latestVitals["respiration"] <= 20)
                ews["respiration"] = 1;
            else if (latestVitals["respiration"] >= 9 && latestVitals["respiration"] <= 14)
                ews["respiration"] = 0;
        }
        if (latestVitals["temperature"] != undefined && latestVitals["temperature"] != "") {
            var temp = 0;
            if ($scope.measurementUnits.temperature == "F")
                temp = ((latestVitals["temperature"] - 32) * (5 / 9));
            else
                temp = latestVitals["temperature"];

            if (temp < 35 || temp >= 38.5)
                ews["temperature"] = 2;
            else if (temp >= 35 && temp <= 38.4)
                ews["temperature"] = 0;
        }

        if (latestVitals["consciousness"] != undefined && latestVitals["consciousness"] != "") {
            if (latestVitals["consciousness"] == "A")
                ews["consciousness"] = 0;
            else if (latestVitals["consciousness"] == "V")
                ews["consciousness"] = 1;
            else if (latestVitals["consciousness"] == "P")
                ews["consciousness"] = 2;
            else if (latestVitals["consciousness"] == "U")
                ews["consciousness"] = 3;
        }

        $scope.earlyWarning = ews["bps"] + ews["pulse"] + ews["respiration"] + ews["temperature"] + ews["consciousness"];
        //console.log($scope.earlyWarning);
        if (($scope.earlyWarning > 5) || ((ews["bps"] >= 3) || (ews["pulse"] >= 3) || (ews["respiration"] >= 3) || (ews["temperature"] >= 3) || (ews["consciousness"] >= 3))) {
            $scope.type = "danger";
        }
        else {
            $scope.type = "info";
        }
        //console.log($scope.earlyWarning)
    }

   

    $scope.onErrorRequiredData = function (data, status, headers, config) {
        $scope.urlRefesh = config.url;
        if (status == 401) {
            //console.log($localStorage.loginUrl);
            $http.get($localStorage.loginUrl).
            success(function (data, status, headers, config) {
                //console.log($scope.urlRefesh);
                $http.get($scope.urlRefesh).
                    success($scope.onFinishedLoadingSelectedVitalsData).
                    error($scope.onErrorLoadingSelectedVitalsData);
            }).
            error(
            function (data, status, headers, config) {
                delete $localStorage.loginUrl;
                if (!$scope.dlg1) {
                    $scope.dlg1 = dialogs.error('Connection expired! You will be logged out.');
                    $scope.dlg1.result.then(function (btn) {
                        //console.log($scope.dlg);
                        $scope.dlg = null;

                        $state.go('login');
                    });
                }

            }
            );
        }
        else {
            //$scope.patientsLoadedInfo = "Error reaching server. Please check your internet connection.";
            $scope.$parent.loaderGifClass.display = "none";
            delete $localStorage.loginUrl;
            if (!$scope.dlg1) {
                $scope.dlg1 = dialogs.error('Unknown error when connecting to the server!', "There seems to be problem with your internet connection!\nCheck you connection and try again!");
                $scope.dlg1.result.then(function (btn) {
                    $scope.dlg = null;

                });
            }

        }
    }

    $scope.onVitalsDataAdded = function (data, status, headers, config) {
        if (data.accepted == true)
        {
            $scope.vitalsUploading = false;
            $modalInstance.close({
                latestVitals: {                     
                    "patientID": $scope.vitalsDataSent.patientID,
                    "bmiStatus": null,
                    "note": null,
                    "temperatureMethod": null,
                    "type": "Vitals",
                    "temperature": $scope.vitalsDataSent.temperature,
                    "oxygenSaturaton": $scope.vitalsDataSent.oxygenSaturation,
                    "pulse": $scope.vitalsDataSent.pulse,
                    "bps": $scope.vitalsDataSent.bps,
                    "bpd": $scope.vitalsDataSent.bpd,
                    "date": $filter('date')($scope.vitalsData.date, "yyyy-MM-ddTHH:mm:ss"),//$filter('date')(newValue.date, "yyyy-MM-ddTHH:mm:ss")
                    "height": $scope.vitalsDataSent.height,
                    "weight": $scope.vitalsDataSent.weight,
                    "respiration": $scope.vitalsDataSent.respiration,
                    "waistCirculation": $scope.vitalsDataSent.waistCircumference,
                    "headCirculation": $scope.vitalsDataSent.headCircumference,
                    "bmi": $scope.vitalsDataSent.bmi,
                    "urineOutput": $scope.vitalsDataSent.urineOutput,
                    "escalationPlan": $scope.vitalsDataSent.escalationPlan,
                    "monitoringFrequency": $scope.vitalsDataSent.monitoringFrequency,
                    "inspiredO2Per": $scope.vitalsDataSent.inspiredO2Per,
                    "consciousness": $scope.vitalsDataSent.consciousness,
                    "painScore": $scope.vitalsDataSent.painScore,

                },
                graphData: {
                    BM: $scope.vitalsDataSent.bmi,
                    BP: {
                        bpd: $scope.vitalsDataSent.bpd,
                        bps: $scope.vitalsDataSent.bps,
                    },
                    HC: $scope.vitalsDataSent.headCircumference,
                    HR: $scope.vitalsDataSent.pulse,
                    HT: $scope.vitalsDataSent.height,
                    RP: $scope.vitalsDataSent.respiration,
                    TP: $scope.vitalsDataSent.temperature,
                    WC: $scope.vitalsDataSent.waistCircumference,
                    WT: $scope.vitalsDataSent.weight,
                    os: $scope.vitalsDataSent.oxygenSaturation

                }
            });
        }

    }
    $scope.vitalsUploading = false;

    $scope.uploadData = function () {
        $scope.vitalsUploading = true;
        $scope.vitalsDataSent = {
            "patientID": $rootScope.patientDetailsToBeDisplayed.patientID,
            "temperature": (($scope.measurementUnits.temperature == 'F') ? $scope.vitalsData.temperature : (($scope.vitalsData["temperature"] - 32) * (5 / 9))),
            "oxygenSaturation": $scope.vitalsData.oxygenSaturation,
            "pulse": $scope.vitalsData.pulse,
            "bps": $scope.vitalsData.bps,
            "bpd": $scope.vitalsData.bpd,
            "date": $filter('date')($scope.vitalsData.date, "MM-dd-yyyy"),//$filter('date')(newValue.date, "yyyy-MM-ddTHH:mm:ss")
            "height": (($scope.measurementUnits.height == 'in') ? $scope.vitalsData.height : ($scope.vitalsData.height * 2.54)),
            "weight": (($scope.measurementUnits.weight == 'lbs') ? $scope.vitalsData.weight : ($scope.vitalsData.weight * 0.45359237)),
            
            "respiration": $scope.vitalsData.respiration,
            "waistCircumference": (($scope.measurementUnits.waistCircumference == 'in') ? $scope.vitalsData.waistCircumference : ($scope.vitalsData.waistCircumference * 2.54)),
            "headCircumference": (($scope.measurementUnits.headCircumference == 'in') ? $scope.vitalsData.headCircumference : ($scope.vitalsData.headCircumference * 2.54)),
            "bmi": $scope.vitalsData.bmi,
            "urineOutput": $scope.vitalsData.urineOutput,
            "escalationPlan": $scope.vitalsData.escalationPlan,
            "monitoringFrequency": $scope.vitalsData.monitoringFrequency,
            "inspiredO2Per": $scope.vitalsData.inspiredO2Per,
            "consciousness": $scope.vitalsData.consciousness,
            "painScore": $scope.vitalsData.painScore,
        }

        //console.log($scope.vitalsDataSent);
        if ($rootScope.onlineLogin == true)
        {
            $http.post($rootScope.urls.patientVitalsUrl, $scope.vitalsDataSent)
                .success($scope.onVitalsDataAdded)
                .error($scope.onErrorVitalsData);
        }
        else
        {
            $modalInstance.close({
                latestVitals: {
                    "patientID": $scope.vitalsDataSent.patientID,
                    "bmiStatus": null,
                    "note": null,
                    "temperatureMethod": null,
                    "type": "Vitals",
                    "temperature": $scope.vitalsDataSent.temperature,
                    "oxygenSaturaton": $scope.vitalsDataSent.oxygenSaturation,
                    "pulse": $scope.vitalsDataSent.pulse,
                    "bps": $scope.vitalsDataSent.bps,
                    "bpd": $scope.vitalsDataSent.bpd,
                    "date": $filter('date')($scope.vitalsData.date, "yyyy-MM-ddTHH:mm:ss"),//$filter('date')(newValue.date, "yyyy-MM-ddTHH:mm:ss")
                    "height": $scope.vitalsDataSent.height,
                    "weight": $scope.vitalsDataSent.weight,
                    "respiration": $scope.vitalsDataSent.respiration,
                    "waistCirculation": $scope.vitalsDataSent.waistCircumference,
                    "headCirculation": $scope.vitalsDataSent.headCircumference,
                    "bmi": $scope.vitalsDataSent.bmi,
                    "urineOutput": $scope.vitalsDataSent.urineOutput,
                    "escalationPlan": $scope.vitalsDataSent.escalationPlan,
                    "monitoringFrequency": $scope.vitalsDataSent.monitoringFrequency,
                    "inspiredO2Per": $scope.vitalsDataSent.inspiredO2Per,
                    "consciousness": $scope.vitalsDataSent.consciousness,
                    "painScore": $scope.vitalsDataSent.painScore,
                },
                graphData: {
                    BM: $scope.vitalsDataSent.bmi,
                    BP: {
                        bpd: $scope.vitalsDataSent.bpd,
                        bps: $scope.vitalsDataSent.bps,
                    },
                    HC: $scope.vitalsDataSent.headCircumference,
                    HR: $scope.vitalsDataSent.pulse,
                    HT: $scope.vitalsDataSent.height,
                    RP: $scope.vitalsDataSent.respiration,
                    TP: $scope.vitalsDataSent.temperature,
                    WC: $scope.vitalsDataSent.waistCircumference,
                    WT: $scope.vitalsDataSent.weight,
                    os: $scope.vitalsDataSent.oxygenSaturation

                }
            });
        }

    }
}]);

app.controller('modalDatePickerController', ['$scope', '$modalInstance', 'data', '$rootScope', function ($scope, $modalInstance, data, $rootScope) {
    $scope.dt = new Date(data.dt);
    $scope.selectDate = function () {
        $rootScope.$broadcast('datePicker.newDateSelected', [$scope.dt, data.pickerSpecs]);
        $modalInstance.dismiss('canceled');
    }

}]);

app.controller('datePickerController', ['$scope', '$filter', 'dialogs', '$rootScope', function ($scope, $filter, dialogs, $rootScope) {
    $scope.pickerSpecs = "dob"
    $scope.status = {
        addDOB: false,
        frd: false,
    };

    $scope.opts = {
        'size': 'sm',
        'windowClass': 'align-modal-dialog'
    };

    $scope.loader_opts = {
        'backdrop': 'static',
        'size': 'sm',
        'windowClass': 'align-modal-dialog'
    };

    $scope.addPatientDates = {
        'dob': new Date(),
        'stats': new Date(),
        'misc': new Date(),
        'iEfsDate': new Date(),
        'iDOB': new Date(),
    };

    $scope.data = {
        dt: new Date,
        pickerSpecs: $scope.pickerSpecs
    };
    $scope.openCalender = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = !$scope.opened;
    };

    $scope.openCalenderInDialog = function ($event, pickerSpecs) {
        $scope.pickerSpecs = pickerSpecs;
        $scope.data.pickerSpecs = $scope.pickerSpecs;
        $scope.data.dt = new Date($scope.addPatientDates[pickerSpecs]);
        $event.preventDefault();
        $event.stopPropagation();
        var dialogInstance = dialogs.create('templates/dialogs/datePicker.html', 'modalDatePickerController', $scope.data, $scope.opts);
    }


    $scope.today = function () {
        $scope.selctedDate = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.selctedDate = null;
    };

    $scope.disabled = function (date, mode) {
        return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    };

    $scope.dateOptions = {
        formatYear: 'yyyy'
    };

    $scope.format = 'MM-dd-yyyy';

    $scope.newDateSelected = function () {
        $scope.$parent.patient.dob = $filter('date')($scope.selctedDate, 'MM-dd-yyyy');
    }

    $scope.onNewDateSelected = function () {
        //console.log()
        $scope.$parent.selectedDate = $scope.selctedDate;//$filter('date')( $scope.selctedDate, 'MMM d, y');
    }

    $scope.$on("datePicker.newDateSelected", function (event, args) {
        $scope.addPatientDates[args[1]] = new Date(args[0]);
        //console.log($scope.addPatientDates);
        $scope.$parent.addPatient.addPatientDates[args[1]] = new Date(args[0]);
    });
    //console.log($scope.$parent);

}]);

app.controller('searchBarCtrl', ['$scope', '$filter', 'dialogs', function ($scope, $filter, dialogs) {
    $scope.patientFilterText = "";
    $scope.filterTextChanged = function () {
        //console.log($scope.patientFilterText);
        if ($scope.patientFilterText != "")
            switch ($scope.$parent.filterType) {
                case "id":
                    if ($scope.patientFilterText.slice(-1).match(/[0-9]*/g)[0] == "") {
                        dialogs.error("Input error", "Please enter only numbers for patient id");
                        $scope.patientFilterText = $scope.patientFilterText.slice(0, -1);
                    }
                    break;
                case "name":
                    if ($scope.patientFilterText.slice(-1).match(/[a-z]*/)[0] == "") {
                        dialogs.error("Input error", "Please enter only alphabets for patient name");
                        $scope.patientFilterText = $scope.patientFilterText.slice(0, -1);
                    }
                    break;

            }
        $scope.$parent.patient.filterText = $scope.patientFilterText;
    }

    $scope.$on('patientSearchPage.filterTypeChanged', function (event, args) {
        $scope.patientFilterText = "";
    });
}]);

app.controller('patientDetailsCtrl', function ($scope, $http, $location, $state, Idle, Keepalive, $stateParams, $sce, $localStorage, dialogs, $rootScope) {
    //console.log($rootScope.patientDetailsToBeDisplayed);
    $scope.hardwareBackButtonClicked = function () {
        //console.log("in patient details controller");
        $scope.backButtonClicked();
    }

    $scope.$on('IdleStart', function () {
        console.log("idle start");
    });

    $scope.$on('IdleEnd', function () {
        console.log("idle End");
    });

    $scope.$on('IdleTimeout', function () {
        $scope.logoutUrl = $rootScope.urls.logoutUrl;

        $http.get($scope.logoutUrl).
            success(function (data, status, headers, config) {
                console.log("logged Out");
                $state.go('login');
            }).
            error(function (data, status, headers, config) {                                      //error callback is called async if an error occurs
                console.log("logged Out error");
                $state.go('login');
            });

    });

    $scope.start = function () {
        Idle.watch();
        $scope.started = true;
    };

    $scope.stop = function () {
        Idle.unwatch();
        $scope.started = false;

    };

    $scope.start();



    $scope.documentLoadedInfo = "No document loaded";
    $scope.loaderGifClass = { "display": "block" };
    //console.log($stateParams.patientListData.data);
    if ($stateParams.patientDetailsObject.patientID == -1) {
        ////console.log("entering");
        $rootScope.patientDetailsToBeDisplayed = $stateParams.patientDetailsObject;
        $rootScope.patientDetailsToBeDisplayed.patientID = 1;
    }


    //===========================
    //load basic patient details --------------------
    $scope.gotPatientData = false;
    $scope.gotContactData = false;
    $scope.gotNotesData = false;

    $scope.checkAddressValue = function (val) {
        if (val == "")
            return ""
        else
            return ", " + val;
    }

    $scope.patientDataLoadedSuccessFunctionInit = function (data, status, headers, config) {
        if (data["patient"]) {
            $rootScope.patientDetailsToBeDisplayed.patient = data["patient"];
            $scope.gotPatientData = true;
            if ($rootScope.patientDetailsToBeDisplayed["patient"].patientImageURL) {
                $scope.patientProfilePic = $rootScope.patientDetailsToBeDisplayed["patient"].patientImageURL;
            }
            else {
                $scope.patientProfilePic = 'assets/images/profilepic.png';
            }
            $scope.checkStringVal = function (val) {
                if (val) {
                    return val;
                }
                else
                    return "";
            }
            $scope.basicDetails = {
                patientImageSource: $sce.trustAsHtml("<img class='patientPicClass' src='" + $scope.patientProfilePic + "' />"),
                name: $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["patient"].firstName) + " " + $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["patient"].lastName),//"Geoffrey Alexander Irwin",
                dob: $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["patient"].dob),
                id: $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["patient"].id),
                age: $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["patient"].age),
                gender: $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["patient"].gender),//"geoff.irwin@gmail.com",
                provider: ""//$scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["patient"].provider.fName) + " " + $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["patient"].provider.lName) // "Healthway Medical"
            };
            if ($rootScope.patientDetailsToBeDisplayed["patient"].provider) {
                $scope.basicDetails.provider = $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["patient"].provider.fName) + " " + $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["patient"].provider.lName);
            }

            $scope.patient = {
                email: $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["patient"].email),//"Male",
                mStatus: $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["patient"].maritalStaus),//"Domestic Partner",
                ss: $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["patient"].ss),//"10-134-746971-0-4",
                licenseID: $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["patient"].driverLicence),//"314G67-N",
                externalID: $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["patient"].externalID),//"1",
                userDefined: $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["patient"].userDefined)//"N/A"


            };
        }
        else if (data["contact"]) {
            $rootScope.patientDetailsToBeDisplayed.contact = data["contact"];
            $scope.gotContactData = true;

            $scope.contactDemo = {
                address: $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["contact"].street) + $scope.checkStringVal($scope.checkAddressValue($rootScope.patientDetailsToBeDisplayed["contact"].city)) + $scope.checkStringVal($scope.checkAddressValue($rootScope.patientDetailsToBeDisplayed["contact"].state)) + $scope.checkStringVal($scope.checkAddressValue($rootScope.patientDetailsToBeDisplayed["contact"].country)),//"app no.2 ,chestnut square wlakeshore drive 10387 phillipines",
                motherName: $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["contact"].mothersName),//"Mary Jane Irwin",
                guardianName: $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["contact"].guardiansName),//"John George Vandermilt",
                emergencyContact: $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["contact"].emergencyContactName),//"Louis Charles Irwin",
                emergencyPhone: $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["contact"].emergencyContactNumber),//"00102357544556",
                homePhone: $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["contact"].homePhoneNumber),//"000 007 005 5678",
                workPhone: $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["contact"].workPhoneNumber),//"455 677 789 3456",
                mobilePhone: $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["contact"].mobilePhoneNumber)//"009 678 567 2345",
            };
        }
        else if (data["notes"]) {
            $rootScope.patientDetailsToBeDisplayed.notes = data["notes"];
            $scope.gotNotesData = true;
            $scope.notes = [];
            if ($rootScope.patientDetailsToBeDisplayed["notes"].length > 0) {
                for (var i = 0; i < $rootScope.patientDetailsToBeDisplayed["notes"].length; i++) {
                    $scope.notes.push($scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["notes"][i].noteTitle) + " : " + $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["notes"][i].noteBody));
                }
            }
            else {
                $scope.notes.push("There are no notes on file for this patient.");
            }
        }
        else if (data["appointments"]) {
            $rootScope.patientDetailsToBeDisplayed.appoinments = data["appointments"];
            $scope.appoinments = $rootScope.patientDetailsToBeDisplayed.appoinments;
        }
        else if (data["allergies"]) {
            $rootScope.patientDetailsToBeDisplayed.medicalHistory.allergies = data["allergies"];
            $scope.allergies = $rootScope.patientDetailsToBeDisplayed.medicalHistory.allergies;
        }

        if ($scope.gotNotesData == true && $scope.gotPatientData == true && $scope.gotContactData == true && $rootScope.patientDetailsToBeDisplayed.appoinments && $rootScope.patientDetailsToBeDisplayed.medicalHistory.allergies) {
            $scope.loaderGifClass.display = "none";
        }
    }

    $scope.patientDataLoadingErrorInit = function (data, status, headers, config) {
        $scope.urlRefesh = config.url;
        if (status == 401) {
            //console.log($localStorage.loginUrl);
            $http.get($localStorage.loginUrl).
            success(function (data, status, headers, config) {
                //console.log($scope.urlRefesh);
                $http.get($scope.urlRefesh).
                    success($scope.patientDataLoadedSuccessFunctionInit).
                    error($scope.patientDataLoadingErrorInit);
            }).
            error(
            function (data, status, headers, config) {
                delete $localStorage.loginUrl;
                if (!$scope.dlg) {
                    $scope.dlg = dialogs.error('Connection expired!', ' You will be logged out!');
                    $scope.dlg.result.then(function (btn) {
                        //console.log($scope.dlg);
                        $scope.dlg = null;
                        $state.go('login');

                    });
                }

            }
            );
        }
        else {
            //$scope.patientsLoadedInfo = "Error reaching server. Please check your internet connection.";
            $scope.loaderGifClass.display = "none";
            delete $localStorage.loginUrl;
            if (!$scope.dlg) {
                $scope.dlg = dialogs.error('Unknown error when connecting to the server!', "There seems to be problem with your internet connection!\nCheck you connection and try again!");
                $scope.dlg.result.then(function (btn) {
                    //$state.go('login');
                    $scope.dlg = null;
                });
            }

        }
        $scope.loaderGifClass.display = "none";
    }

    //console.log($rootScope.patientDetailsToBeDisplayed);
    if (!$rootScope.patientDetailsToBeDisplayed["patient"].id) {
        $http.get($rootScope.urls.patientDetailsUrl + $rootScope.patientDetailsToBeDisplayed.patientID).
            success($scope.patientDataLoadedSuccessFunctionInit).
            error($scope.patientDataLoadingErrorInit);
    }
    if (!$rootScope.patientDetailsToBeDisplayed["contact"].patientID) {
        $http.get($rootScope.urls.patientContactsUrl + $rootScope.patientDetailsToBeDisplayed.patientID).
            success($scope.patientDataLoadedSuccessFunctionInit).
            error($scope.patientDataLoadingErrorInit);
    }
    if ($rootScope.patientDetailsToBeDisplayed["notes"].length == 0) {
        $http.get($rootScope.urls.patientNotesUrl + $rootScope.patientDetailsToBeDisplayed.patientID).
               success($scope.patientDataLoadedSuccessFunctionInit).
               error($scope.patientDataLoadingErrorInit);
    }
    if (!$rootScope.patientDetailsToBeDisplayed.appoinments) {
        $scope.url = $rootScope.urls.patientAppoinementsUrl + $rootScope.patientDetailsToBeDisplayed.patientID;
        $http.get($scope.url)
            .success($scope.patientDataLoadedSuccessFunctionInit)
            .error($scope.patientDataLoadingErrorInit);
    }
    if (!$rootScope.patientDetailsToBeDisplayed.medicalHistory.allergies) {
        $scope.url = $rootScope.urls.patientAllergiesUrl + $rootScope.patientDetailsToBeDisplayed.patientID;
        $http.get($scope.url)
            .success($scope.patientDataLoadedSuccessFunctionInit)
            .error($scope.patientDataLoadingErrorInit);
    }
    if ($rootScope.patientDetailsToBeDisplayed["patient"].id && $rootScope.patientDetailsToBeDisplayed["contact"].patientID && $rootScope.patientDetailsToBeDisplayed["notes"].length != 0 && $rootScope.patientDetailsToBeDisplayed.appoinments && $rootScope.patientDetailsToBeDisplayed.medicalHistory.allergies) {
        $scope.loaderGifClass.display = "none";
    }
    //--------------------------------------

    //console.log($rootScope.patientDetailsToBeDisplayed["patient"].firstName);
    $scope.patientHomeStyleClass = { "border-bottom": "#30B69D", "border-bottom-style": "solid" };
    $scope.patientHistoryStyleClass = { "border-bottom": "#E4E8EB", "border-bottom-style": "solid" };
    $scope.patientEncountersStyleClass = { "border-bottom": "#E4E8EB", "border-bottom-style": "solid" };
    $scope.patientDocumentsStyleClass = { "border-bottom": "#E4E8EB", "border-bottom-style": "solid" };
    $scope.patientTransactionStyleClass = { "border-bottom": "#E4E8EB", "border-bottom-style": "solid" };
    $scope.patientIssuesStyleClass = { "border-bottom": "#E4E8EB", "border-bottom-style": "solid" };

    $scope.patientPatientInfoStyleClass = { "background-color": "#0075bf" };
    $scope.patientRemindersStyleClass = { "background-color": "#718b9c" };
    $scope.patientMedicalHistoryStyleClass = { "background-color": "#718b9c" };
    $scope.patientDisclosureStyleClass = { "background-color": "#718b9c" };
    $scope.patientVitalsStyleClass = { "background-color": "#718b9c" };

    $scope.patientContactDemoStyleClass = { "border-bottom": "#30B69D", "border-bottom-style": "solid" };
    $scope.patientChoicesDemoStyleClass = { "border-bottom": "#E4E8EB", "border-bottom-style": "solid" };
    $scope.patientEmployerDemoStyleClass = { "border-bottom": "#E4E8EB", "border-bottom-style": "solid" };
    $scope.patientStatsDemoStyleClass = { "border-bottom": "#E4E8EB", "border-bottom-style": "solid" };
    $scope.patientMiscDemoStyleClass = { "border-bottom": "#E4E8EB", "border-bottom-style": "solid" };

    $scope.patientClinicalRemindersStyleClass = { "border-bottom": "#30B69D", "border-bottom-style": "solid" };
    $scope.patientRemindersStyleClass = { "border-bottom": "#E4E8EB", "border-bottom-style": "solid" };
    $scope.patientMessagesRemindersStyleClass = { "border-bottom": "#E4E8EB", "border-bottom-style": "solid" };


    $scope.patientClinicalRemindersStyleClass = { "border-bottom": "#30B69D", "border-bottom-style": "solid" };
    $scope.patientRemindersStyleClass = { "border-bottom": "#E4E8EB", "border-bottom-style": "solid" };

    $scope.mainSelection = [true, false, false, false, false, false];
    $scope.homeSelection = [true, false, false, false, false];
    $scope.piSelection = [true, false, false, false, false];

    $scope.documentTabActive = false;
    $scope.selectedHeader = { path: "templates/directives/patientDetailsPage/mainTabContents/homeTabSelectionPage.html" };
    /*if ($scope.selectedHeader.path == "templates/directives/patientDetailsPage/mainTabContents/documentsTabSelectionPage.html")
    {
        console.log("Enterinhg");
        $scope.patientHomeStyleClass = { "border-bottom": "#E4E8EB", "border-bottom-style": "solid" };
        $scope.patientHistoryStyleClass = { "border-bottom": "#E4E8EB", "border-bottom-style": "solid" };
        $scope.patientReportStyleClass = { "border-bottom": "#E4E8EB", "border-bottom-style": "solid" };
        $scope.patientDocumentsStyleClass = { "border-bottom": "#E4E8EB", "border-bottom-style": "solid" };
        $scope.patientTransactionStyleClass = { "border-bottom": "#E4E8EB", "border-bottom-style": "solid" };
        $scope.patientIssuesStyleClass = { "border-bottom": "#E4E8EB", "border-bottom-style": "solid" };
        $scope.documentTabActive = true;
        //$scope.patientDocumentsStyleClass = { "border-bottom": "#30B69D", "border-bottom-style": "solid" };
    }*/
    $scope.homeSelectedHeader = { path: "templates/directives/patientDetailsPage/homeTabContents/patientInfoTabSelectionPage.html" };
    $scope.demographicsSelectedHeader = { path: "templates/directives/patientDetailsPage/demoGraphicsTabContents/contactTabContent.html" };
    $scope.remindersSelectedHeader = { path: "templates/directives/patientDetailsPage/remindersTabContents/clinicalTabContent.html" };
    $scope.mainSelection[$rootScope.patientDetailsToBeDisplayed.mainTabState] = true;
    $scope.homeSelection[$rootScope.patientDetailsToBeDisplayed.homeTabState] = true;
    $scope.piSelection[$rootScope.patientDetailsToBeDisplayed.piTabState] = true;




    if ($rootScope.patientDetailsToBeDisplayed["patient"].patientImageURL) {
        $scope.patientProfilePic = $rootScope.patientDetailsToBeDisplayed["patient"].patientImageURL;
    }
    else {
        $scope.patientProfilePic = 'assets/images/profilepic.png';
    }
    $scope.checkStringVal = function (val) {
        if (val) {
            return val;
        }
        else
            return "";
    }
    $scope.basicDetails = {
        patientImageSource: $sce.trustAsHtml("<img class='patientPicClass' src='" + $scope.patientProfilePic + "' />"),
        name: $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["patient"].firstName) + " " + $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["patient"].lastName),//"Geoffrey Alexander Irwin",
        dob: $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["patient"].dob),
        id: $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["patient"].id),
        age: $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["patient"].age),//"January 01,1978(37)",
        gender: $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["patient"].gender),//"geoff.irwin@gmail.com",
        provider: ""//$scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["patient"].provider.fName) + " " + $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["patient"].provider.lName) // "Healthway Medical"
    };
    $scope.allergies = $rootScope.patientDetailsToBeDisplayed.medicalHistory.allergies;
    $scope.appoinments = $rootScope.patientDetailsToBeDisplayed.appoinments;
    if ($rootScope.patientDetailsToBeDisplayed["patient"].provider) {
        $scope.basicDetails.provider = $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["patient"].provider.fName) + " " + $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["patient"].provider.lName);
    }

    $scope.patient = {
        email: $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["patient"].email),//"Male",
        mStatus: $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["patient"].maritalStaus),//"Domestic Partner",
        ss: $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["patient"].ss),//"10-134-746971-0-4",
        licenseID: $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["patient"].driverLicence),//"314G67-N",
        externalID: $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["patient"].externalID),//"1",
        userDefined: $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["patient"].userDefined)//"N/A"


    };
    $scope.contactDemo = {
        address: $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["contact"].street) + ", " + $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["contact"].city) + ", " + $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["contact"].state) + ", " + $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["contact"].country),//"app no.2 ,chestnut square wlakeshore drive 10387 phillipines",
        motherName: $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["contact"].mothersName),//"Mary Jane Irwin",
        guardianName: $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["contact"].guardiansName),//"John George Vandermilt",
        emergencyContact: $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["contact"].emergencyContactName),//"Louis Charles Irwin",
        emergencyPhone: $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["contact"].emergencyContactNumber),//"00102357544556",
        homePhone: $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["contact"].homePhoneNumber),//"000 007 005 5678",
        workPhone: $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["contact"].workPhoneNumber),//"455 677 789 3456",
        mobilePhone: $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["contact"].mobilePhoneNumber)//"009 678 567 2345",
    };
    $scope.choicesDemo = {
        referringProvider: "",
        pharmacy: "",
        hippaNotice: "",
        leaveMessage: "",
        allowVoice: null,
        allowSMS: null,
        allowEmail: null,
        allowRU: null,
        allowIS: null,
        allowHIE: null,
        allowPP: null
    };
    $scope.employerDemo = {
        occupationAddress: "",
        employerName: ""
    };

    $scope.statsDemo = {
        language: "",
        ethnicity: "",
        race: "",
        financialReviewDate: "",
        familySize: "",
        monthlyIncome: "",
        homelessetc: "",
        interpreter: "",
        migrant: "",
        referralSource: "",
        vfc: ""
    };
    $scope.miscDemo = {
        dateDeceased: "",
        reasonDeceased: ""
    };

    $scope.choiceText = [
        { "text": "ALLOW VOICE MESSAGE?", "choice": "null" },
        { "text": "ALLOW SMS?", "choice": "null" },
        { "text": "ALLOW EMAIL?", "choice": "null" },
        { "text": "ALLOW IMMUNIZATION REGISTRY USE?", "choice": "null" },
        { "text": "ALLOW IMMUNIZATION INFO SHARING?", "choice": "null" },
        { "text": "ALLOW HEALTH INFORMATION EXCHANGE?", "choice": "null" },
        { "text": "ALLOW PATIENT PORTAL?", "choice": "null" },
        { "text": "ALLOW NOTICE?", "choice": "null" }
    ]

    $scope.notes = [
    ];
    //console.log($rootScope.patientDetailsToBeDisplayed["notes"].length);
    if ($rootScope.patientDetailsToBeDisplayed["notes"].length > 0) {
        for (var i = 0; i < $rootScope.patientDetailsToBeDisplayed["notes"].length; i++) {
            $scope.notes.push($scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["notes"][i].noteTitle) + " : " + $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["notes"][i].noteBody));
        }
    }
    else {
        $scope.notes.push("There are no notes on file for this patient.");
    }
    $scope.checkChoiceVal = function (val) {
        if (val == "" || val == null || val == undefined)
            return "null";
        else
            return val;
    }
    $scope.patientDataLoadedSuccessFunction = function (data, status, headers, config) {
        if (data["choice"]) {
            $rootScope.patientDetailsToBeDisplayed["choice"] = data["choice"];
            //console.log($rootScope.patientDetailsToBeDisplayed["choice"]);
            if ($rootScope.patientDetailsToBeDisplayed["choice"].referringProvider) {
                $scope.choicesDemo.referringProvider = $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["choice"].referringProvider.fName) + " " + $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["choice"].referringProvider.lName);
            } else {
                $scope.choicesDemo.referringProvider = " ";
            }
            $scope.choicesDemo.pharmacy = $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["choice"].pharmacy);
            $scope.choicesDemo.leaveMessage = $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["choice"].leaveMessageWith);

            $scope.choiceText[7].choice = $scope.checkChoiceVal($rootScope.patientDetailsToBeDisplayed["choice"].hipaaNoticedRecieved);
            $scope.choiceText[0].choice = $scope.checkChoiceVal($rootScope.patientDetailsToBeDisplayed["choice"].hipaaAllowVoiceMessage);
            $scope.choiceText[1].choice = $scope.checkChoiceVal($rootScope.patientDetailsToBeDisplayed["choice"].hipaaAllowSMS);
            $scope.choiceText[2].choice = $scope.checkChoiceVal($rootScope.patientDetailsToBeDisplayed["choice"].hippaAllowEmail);
            $scope.choiceText[3].choice = $scope.checkChoiceVal($rootScope.patientDetailsToBeDisplayed["choice"].hipaaAllowImmunizationRegUse);
            $scope.choiceText[4].choice = $scope.checkChoiceVal($rootScope.patientDetailsToBeDisplayed["choice"].hippaImmunizationInfoSharing);
            $scope.choiceText[5].choice = $scope.checkChoiceVal($rootScope.patientDetailsToBeDisplayed["choice"].hipaaAllowHealthInfoExchange);
            $scope.choiceText[6].choice = $scope.checkChoiceVal($rootScope.patientDetailsToBeDisplayed["choice"].hipaaAllowPatientPortal);
            $scope.demographicsSelectedHeader.path = "templates/directives/patientDetailsPage/demoGraphicsTabContents/choiceTabContent.html";
        }
        else if (data["employer"]) {
            $rootScope.patientDetailsToBeDisplayed["employer"] = data["employer"];
            $scope.employerDemo.occupationAddress = $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["employer"].empStreet) + $scope.checkStringVal($scope.checkAddressValue($rootScope.patientDetailsToBeDisplayed["employer"].empCity)) + $scope.checkStringVal($scope.checkAddressValue($rootScope.patientDetailsToBeDisplayed["employer"].empState)) + $scope.checkStringVal($scope.checkAddressValue($rootScope.patientDetailsToBeDisplayed["employer"].empCountry)) + $scope.checkStringVal($scope.checkAddressValue($rootScope.patientDetailsToBeDisplayed["employer"].empPostalCode));
            $scope.employerDemo.employerName = $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["employer"].empName);
            $scope.demographicsSelectedHeader.path = "templates/directives/patientDetailsPage/demoGraphicsTabContents/employerTabContent.html";
        }
        else if (data["misc"]) {
            $rootScope.patientDetailsToBeDisplayed["misc"] = data["misc"];
            if ($rootScope.patientDetailsToBeDisplayed["misc"].mDeceasedDetails) {
                $scope.miscDemo.dateDeceased = $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["misc"].mDeceasedDetails.patientDeceasedDate);
                $scope.miscDemo.reasonDeceased = $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["misc"].mDeceasedDetails.patientDeceasedReason);
            }
            else {
                $scope.miscDemo.dateDeceased = " ";
                $scope.miscDemo.reasonDeceased = " ";
            }
            $scope.demographicsSelectedHeader.path = "templates/directives/patientDetailsPage/demoGraphicsTabContents/miscTabContent.html";
        }
        else if (data["stats"]) {
            $rootScope.patientDetailsToBeDisplayed["stats"] = data["stats"];
            $scope.statsDemo.language = $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["stats"].language);
            $scope.statsDemo.ethnicity = $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["stats"].ethnicity);
            $scope.statsDemo.race = $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["stats"].race);
            $scope.statsDemo.financialReviewDate = $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["stats"].financialReview);
            $scope.statsDemo.familySize = $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["stats"].familySize);
            $scope.statsDemo.monthlyIncome = $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["stats"].monthlyIncome);
            $scope.statsDemo.homelessetc = $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["stats"].homeless);
            $scope.statsDemo.interpreter = $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["stats"].interpreter);
            $scope.statsDemo.migrant = $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["stats"].migrantSeasonal);
            $scope.statsDemo.referralSource = $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["stats"].referalSource);
            $scope.statsDemo.vfc = $scope.checkStringVal($rootScope.patientDetailsToBeDisplayed["stats"].vfc);
            $scope.demographicsSelectedHeader.path = "templates/directives/patientDetailsPage/demoGraphicsTabContents/statsTabContent.html";
        }
        $scope.loaderGifClass.display = "none";
    }
    $scope.patientDataLoadedErrorFunction = function (data, status, headers, config) {
        $scope.urlRefesh = config.url;
        if (status == 401) {
            //console.log($localStorage.loginUrl);
            $http.get($localStorage.loginUrl).
            success(function (data, status, headers, config) {
                //console.log($scope.urlRefesh);
                $http.get($scope.urlRefesh).
                    success($scope.patientDataLoadedSuccessFunction).
                    error($scope.patientDataLoadedErrorFunction);
            }).
            error(
            function (data, status, headers, config) {
                delete $localStorage.loginUrl;
                if (!$scope.dlg1) {
                    $scope.dlg1 = dialogs.error('Connecton expired!', ' You will be logged out!');
                    $scope.dlg1.result.then(function (btn) {
                        //console.log($scope.dlg);
                        $scope.dlg = null;
                        $state.go('login');

                    });
                }

            }
            );
        }
        else {
            //$scope.patientsLoadedInfo = "Error reaching server. Please check your internet connection.";
            $scope.loaderGifClass.display = "none";
            delete $localStorage.loginUrl;
            if (!$scope.dlg1) {
                $scope.dlg1 = dialogs.error('Unknown error when connecting to the server!', "There seems to be problem with your internet connection!\nCheck you connection and try again!");
                $scope.dlg1.result.then(function (btn) {
                    $scope.dlg1 = null;
                    //$state.go('login');
                });
            }

        }
    }
    $scope.getPatientData = function (url) {
        $scope.loaderGifClass.display = "block";
        $http.get(url).
           success($scope.patientDataLoadedSuccessFunction).
           error($scope.patientDataLoadedErrorFunction);
    }




    $scope.getDocumentData = function (url) {
        $scope.loaderGifClass.display = "block";
        $scope.documentDataSucess = function (data, status, headers, config) {

            $rootScope.patientDetailsToBeDisplayed.documents = data["documents"];
            if ($rootScope.patientDetailsToBeDisplayed.documents.length > 0) {
                $scope.documentLoadedInfo = "Documents loaded";

            }
            else {
                $scope.documentLoadedInfo = "No Documents found";
            }

            $scope.loaderGifClass.display = "none";
            $scope.selectedHeader.path = "templates/directives/patientDetailsPage/mainTabContents/documentsTabSelectionPage.html";
        }

        $scope.documentDataError = function (data, status, headers, config) {
            $scope.documentLoadedInfo = "Error reaching server. Please check your internet connection.";
            $scope.urlRefesh = config.url;
            if (status == 401) {
                //console.log($localStorage.loginUrl);
                $http.get($localStorage.loginUrl).
                success(function (data, status, headers, config) {
                    //console.log($scope.urlRefesh);
                    $http.get($scope.urlRefesh).
                        success($scope.documentDataSucess).
                        error($scope.documentDataError);
                }).
                error(
                function (data, status, headers, config) {
                    delete $localStorage.loginUrl;
                    if (!$scope.dlg1) {
                        $scope.dlg1 = dialogs.error('Connection expired!', ' You will be logged out!');
                        $scope.dlg1.result.then(function (btn) {
                            //console.log($scope.dlg);
                            $scope.dlg1 = null;
                            $state.go('login');
                        });
                    }

                }
                );
            }
            else {
                //$scope.patientsLoadedInfo = "Error reaching server. Please check your internet connection.";
                //
                delete $localStorage.loginUrl;
                if (!$scope.dlg1) {
                    $scope.dlg1 = dialogs.error('Unknown error when connecting to the server!', "There seems to be problem with your internet connection!\nCheck you connection and try again!");
                    $scope.dlg1.result.then(function (btn) {
                        //$state.go('login');
                        $scope.dlg1 = null;
                    });
                }

            }
            $scope.$parent.loaderGifClass.display = "none";
        }

        $http.get(url).
        success($scope.documentDataSucess).
        error($scope.documentDataError);
    }
    $scope.onDocumentClicker = function (event, docClicker) {
        //console.log("document selected");
        //console.log(docClicker.documentName);

        //console.log($rootScope.patientDetailsToBeDisplayed["contact"].patientID);
        //$scope.docUrl = "http://15.125.95.198/openemr/sites/phildemo/documents/" + $rootScope.patientDetailsToBeDisplayed["contact"].patientID + "/" + docClicker.documentName;
        // $scope.docUrl = "http://15.125.95.198/openemr/sites/phildemo/documents/5" + "/" + docClicker.documentName;
        //console.log($scope.docUrl);

        //$state.go('pdfViewerPage', { document: docClicker, patientDetailsObject: $rootScope.patientDetailsToBeDisplayed });
        if (docClicker.documentName.slice(-4, docClicker.documentName.length) == ".pdf") {
            event.preventDefault();
            $state.go('pdfViewerPage', { patientListData: $stateParams.patientListData, document: docClicker, patientDetailsObject: $rootScope.patientDetailsToBeDisplayed });
        }

    }


    $scope.onPatientPageTabClicked = function (atrs) {
        $scope.patientHomeStyleClass = { "border-bottom": "#E4E8EB", "border-bottom-style": "solid" };
        $scope.patientHistoryStyleClass = { "border-bottom": "#E4E8EB", "border-bottom-style": "solid" };
        $scope.patientEncountersStyleClass = { "border-bottom": "#E4E8EB", "border-bottom-style": "solid" };
        $scope.patientDocumentsStyleClass = { "border-bottom": "#E4E8EB", "border-bottom-style": "solid" };
        $scope.patientTransactionStyleClass = { "border-bottom": "#E4E8EB", "border-bottom-style": "solid" };
        $scope.patientIssuesStyleClass = { "border-bottom": "#E4E8EB", "border-bottom-style": "solid" };

        if (atrs == "home") {
            $rootScope.patientDetailsToBeDisplayed.mainTabState = 0;
            $scope.patientHomeStyleClass = { "border-bottom": "#30B69D", "border-bottom-style": "solid" };
            $scope.selectedHeader.path = "templates/directives/patientDetailsPage/mainTabContents/homeTabSelectionPage.html";
        }
        else if (atrs == "history") {
            $rootScope.patientDetailsToBeDisplayed.mainTabState = 1;
            $scope.patientHistoryStyleClass = { "border-bottom": "#30B69D", "border-bottom-style": "solid" };
            $scope.selectedHeader.path = "templates/directives/patientDetailsPage/mainTabContents/historyTabSelectionPage.html";
        }
        else if (atrs == "encounters") {
            $rootScope.patientDetailsToBeDisplayed.mainTabState = 2;
            $scope.patientEncountersStyleClass = { "border-bottom": "#30B69D", "border-bottom-style": "solid" };
            $scope.selectedHeader.path = "templates/directives/patientDetailsPage/mainTabContents/encountersTabSelectionPage.html";
            //alert("Reports is under construction");
        }
        else if (atrs == "documents") {
            $rootScope.patientDetailsToBeDisplayed.mainTabState = 3;
            $scope.patientDocumentsStyleClass = { "border-bottom": "#30B69D", "border-bottom-style": "solid" };
            if (!$rootScope.patientDetailsToBeDisplayed.documents) {
                $scope.getDocumentData($rootScope.urls.patientDocumentsUrl + $rootScope.patientDetailsToBeDisplayed.patientID);
            }
            else {
                $scope.selectedHeader.path = "templates/directives/patientDetailsPage/mainTabContents/documentsTabSelectionPage.html";
            }
        }

        else if (atrs == "transaction") {
            $rootScope.patientDetailsToBeDisplayed.mainTabState = 4;
            $scope.patientTransactionStyleClass = { "border-bottom": "#30B69D", "border-bottom-style": "solid" };
            $scope.selectedHeader.path = "templates/directives/patientDetailsPage/mainTabContents/transactionsTabSelectionPage.html";

        }
        else if (atrs == "issues") {
            $rootScope.patientDetailsToBeDisplayed.mainTabState = 5;
            $scope.patientIssuesStyleClass = { "border-bottom": "#30B69D", "border-bottom-style": "solid" };
            $scope.selectedHeader.path = "templates/directives/patientDetailsPage/mainTabContents/issuesTabSelectionPage.html";

        }
    }
    $scope.onPatientDetailsTabClicked = function (info) {
        $scope.patientPatientInfoStyleClass = { "background-color": "#718b9c" };
        $scope.patientRemindersStyleClass = { "background-color": "#718b9c" };
        $scope.patientMedicalHistoryStyleClass = { "background-color": "#718b9c" };
        $scope.patientDisclosureStyleClass = { "background-color": "#718b9c" };
        $scope.patientVitalsStyleClass = { "background-color": "#718b9c" };

        if (info == "patientInfo") {
            $rootScope.patientDetailsToBeDisplayed.homeTabState = 0;
            $scope.patientPatientInfoStyleClass = { "background-color": "#0075bf" };
            $scope.homeSelectedHeader.path = "templates/directives/patientDetailsPage/homeTabContents/patientInfoTabSelectionPage.html";
        }
        else if (info == "reminders") {
            $rootScope.patientDetailsToBeDisplayed.homeTabState = 2;
            $scope.patientRemindersStyleClass = { "background-color": "#0075bf" };
            $scope.homeSelectedHeader.path = "templates/directives/patientDetailsPage/homeTabContents/remindersTabSelectionPage.html";
            //alert("Reminders in progress");
        }
        else if (info == "medicalHistory") {
            $rootScope.patientDetailsToBeDisplayed.homeTabState = 3;
            $scope.patientMedicalHistoryStyleClass = { "background-color": "#0075bf" };
            $scope.homeSelectedHeader.path = "templates/directives/patientDetailsPage/homeTabContents/medicalHistoryTabSelectionPage.html";
            //alert("Medical History in progress");
        }
        else if (info == "disclosure") {
            $rootScope.patientDetailsToBeDisplayed.homeTabState = 4;
            $scope.patientDisclosureStyleClass = { "background-color": "#0075bf" };
            $scope.homeSelectedHeader.path = "templates/directives/patientDetailsPage/homeTabContents/disclosureTabSelectionPage.html";
            //alert("Disclosure in progress");
        }
        else if (info == "vitals") {
            $rootScope.patientDetailsToBeDisplayed.homeTabState = 5;
            $scope.patientVitalsStyleClass = { "background-color": "#0075bf" };
            $scope.homeSelectedHeader.path = "templates/directives/patientDetailsPage/homeTabContents/vitalsTabSelectionPage.html";
        }

    }


    $scope.onPatientDemoTabClicked = function (demo) {
        //console.log($rootScope.patientDetailsToBeDisplayed.piTabState + "Entering");
        $scope.patientContactDemoStyleClass = { "border-bottom": "#E4E8EB", "border-bottom-style": "solid" };
        $scope.patientChoicesDemoStyleClass = { "border-bottom": "#E4E8EB", "border-bottom-style": "solid" };
        $scope.patientEmployerDemoClass = { "border-bottom": "#E4E8EB", "border-bottom-style": "solid" };
        $scope.patientStatsDemoStyleClass = { "border-bottom": "#E4E8EB", "border-bottom-style": "solid" };
        $scope.patientMiscDemoStyleClass = { "border-bottom": "#E4E8EB", "border-bottom-style": "solid" };
        if (demo == "contact") {
            $rootScope.patientDetailsToBeDisplayed.piTabState = 0;
            $scope.patientContactDemoStyleClass = { "border-bottom": "#30B69D", "border-bottom-style": "solid" };
            $scope.demographicsSelectedHeader.path = "templates/directives/patientDetailsPage/demoGraphicsTabContents/contactTabContent.html";
        }
        else if (demo == "choices") {
            $rootScope.patientDetailsToBeDisplayed.piTabState = 1;
            $scope.patientChoicesDemoStyleClass = { "border-bottom": "#30B69D", "border-bottom-style": "solid" };
            if (!$rootScope.patientDetailsToBeDisplayed["choice"]) {
                $scope.getPatientData($rootScope.urls.patientChoicesUrl + $rootScope.patientDetailsToBeDisplayed.patientID);
            }
            else {
                $scope.tempVar = {
                    'choice': $rootScope.patientDetailsToBeDisplayed["choice"]
                };
                $scope.patientDataLoadedSuccessFunction($scope.tempVar);
                $scope.demographicsSelectedHeader.path = "templates/directives/patientDetailsPage/demoGraphicsTabContents/choiceTabContent.html";
            }
        }
        else if (demo == "employer") {
            $rootScope.patientDetailsToBeDisplayed.piTabState = 2;
            $scope.patientEmployerDemoClass = { "border-bottom": "#30B69D", "border-bottom-style": "solid" };
            if (!$rootScope.patientDetailsToBeDisplayed["employer"]) {
                $scope.getPatientData($rootScope.urls.patientEmployerUrl + $rootScope.patientDetailsToBeDisplayed.patientID);
            }
            else {
                $scope.tempVar = {
                    'employer': $rootScope.patientDetailsToBeDisplayed["employer"]
                };
                $scope.patientDataLoadedSuccessFunction($scope.tempVar);
                $scope.demographicsSelectedHeader.path = "templates/directives/patientDetailsPage/demoGraphicsTabContents/employerTabContent.html";
            }
        }
        else if (demo == "stats") {
            $rootScope.patientDetailsToBeDisplayed.piTabState = 3;
            $scope.patientStatsDemoStyleClass = { "border-bottom": "#30B69D", "border-bottom-style": "solid" };
            if (!$rootScope.patientDetailsToBeDisplayed["stats"]) {
                $scope.getPatientData($rootScope.urls.patientStatsUrl + $rootScope.patientDetailsToBeDisplayed.patientID);
            }
            else {
                $scope.tempVar = {
                    'stats': $rootScope.patientDetailsToBeDisplayed["stats"]
                };
                $scope.patientDataLoadedSuccessFunction($scope.tempVar);
                $scope.demographicsSelectedHeader.path = "templates/directives/patientDetailsPage/demoGraphicsTabContents/statsTabContent.html";
            }
        }
        else if (demo == "misc") {
            $rootScope.patientDetailsToBeDisplayed.piTabState = 4;
            $scope.patientMiscDemoStyleClass = { "border-bottom": "#30B69D", "border-bottom-style": "solid" };
            if (!$rootScope.patientDetailsToBeDisplayed["misc"]) {
                $scope.getPatientData($rootScope.urls.patientMiscUrl + $rootScope.patientDetailsToBeDisplayed.patientID);
            }
            else {
                $scope.tempVar = {
                    'misc': $rootScope.patientDetailsToBeDisplayed["misc"]
                };
                $scope.patientDataLoadedSuccessFunction($scope.tempVar);
                $scope.demographicsSelectedHeader.path = "templates/directives/patientDetailsPage/demoGraphicsTabContents/miscTabContent.html";
            }
        }
    }


    $scope.backButtonClicked = function () {
        $state.go('patientSearch', { patientListData: $stateParams.patientListData });
    }

});



app.controller('customChoiceViewCtrl', ['$scope', '$http', '$attrs', function ($scope, $http) {
    $scope.customChoiceViewTableClass = { "border-color": "#0175C0" };
    $scope.choiceViewTextClass = { "color": "#0175C0" };
    $scope.choiceViewChoiceClass = {
        "color": "white",
        "background-color": "#0175C0"
    };
    $scope.message = $scope.text;
    if ($scope.choice == "YES") {
        $scope.chioce = $scope.choice
    }
    else
        $scope.chioce = "NO";

    if ($scope.choice == "null") {
        $scope.customChoiceViewTableClass["border-color"] = "#A3A3A3";
        $scope.choiceViewTextClass["color"] = "#A3A3A3";
        $scope.choiceViewChoiceClass["background-color"] = "#A3A3A3";
    }


}]);

/*app.controller('historyTabSelectionCtrl', ['$scope', '$http', '$filter', '$rootScope', function ($scope, $http, $filter, $rootScope) {
    $scope.historySelection = [];//[true, false, false, false, false];
    $scope.historySelection[$rootScope.patientDetailsToBeDisplayed.historyTabState] = true;


    $scope.onPatientHistoryTabClicked = function (selectedValue)
    {
        console.log(selectedValue);
    }
}]);*/



app.controller('customRelativeCtrl', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {
    $scope.customRelativesViewTableClass = { "border-color": "#0175C0" };

    $scope.relativesViewTextClass = { "color": "#0175C0" };
    $scope.relativesViewInfoClass = { "color": "#0175C0" };

    $scope.relativesViewRelativesClass = {
        "color": "white",
        "background-color": "#0175C0"
    };
    $scope.relativesMessage = $scope.text;
    if ($scope.info == "yes" || $scope.info == "YES" || $scope.info == "no" || $scope.info == "NO" || $scope.info == "No") {
        $scope.relativesInfo = "";
    }
    else {
        //console.log($scope.date);
        if ($scope.date)
            //console.log($filter('date')($scope.date.split("T")[0], "MM-dd-yyyy"));
            $scope.relativesInfo = $scope.info + " on " + $filter('date')($scope.date, "MM-dd-yyyy");
        else
            $scope.relativesInfo = $scope.info;
    }
    //console.log($scope.choice);
    // if ($scope.choice == "YES") {
    $scope.relativesChoice = $scope.choice;
    //}
    //else
    //   $scope.relativesChoice = "YES";

    if ($scope.choice == "null" || $scope.choice == "NA" || $scope.choice == null || $scope.choice == "no") {
        $scope.customRelativesViewTableClass["border-color"] = "#A3A3A3";
        $scope.relativesViewTextClass["color"] = "#A3A3A3";
        $scope.relativesViewInfoClass["color"] = "#A3A3A3";
        $scope.relativesViewRelativesClass["background-color"] = "#A3A3A3";
        $scope.relativesChoice = "NO";
    }


}]);

app.controller('historyTabSelectionCtrl', ['$scope', '$http', '$filter', '$localStorage', 'dialogs', '$rootScope', function ($scope, $http, $filter, $localStorage, dialogs, $rootScope) {
    $scope.riskFactorType = ["Sort by Input Date", "Sort by Risk Factor"];
    $scope.riskFactorFilter = $scope.riskFactorType[0];
    $scope.riskFactorChanged = function (choice) {
        $scope.riskFactorFilter = choice;
    }
    $scope.riskFactor = {
        food: "Fatty/Salty Foods",
        weather: "Sudden Weather Changes",
        exercises: "Extensive and or/Intense Exercises",
        seafood: "Seafoods"

    }


    $scope.examType = ["Sort by Exam/Test Type", "Sort by Collection Date"];
    $scope.examFilter = $scope.examType[0];
    $scope.examChanged = function (choice) {


        $scope.examFilter = choice;
    }
    $scope.exam = {
        glycomark: "Glycomark(R)",
        haemoglobin: "Haemoglobin a1c",
        bloodChemistry: "Blood Chemistry",
        amylase: "Amylase",
        urineCulture: "Urine Culture"
    }

    $scope.historyLifestyleData = {};

    $scope.historySelection = [true, false, false, false, false];
    $scope.historySelection[$rootScope.patientDetailsToBeDisplayed.historyTabState] = true;

    $scope.patientGeneralStyleClass = { "background-color": "#718b9c" };
    $scope.patientFamilyhistoryStyleClass = { "background-color": "#718b9c" };
    $scope.patientRelativesStyleClass = { "background-color": "#718b9c" };
    $scope.patientLifestyleStyleClass = { "background-color": "#718b9c" };
    $scope.patientOtherStyleClass = { "background-color": "#718b9c" };

    $scope.historyData = $rootScope.patientDetailsToBeDisplayed.historyData;
    $scope.selectedValue = "general";
    $scope.historySelectedHeader = { path: "" };
    $scope.onPatientHistoryTabClicked = function (selectedValue) {
        $scope.selectedValue = selectedValue;
        switch (selectedValue) {
            case "general":
                $rootScope.patientDetailsToBeDisplayed.historyTabState = 0;
                //console.log(selectedValue);

                break;
            case "familyHistory":

                $rootScope.patientDetailsToBeDisplayed.historyTabState = 1;
                //console.log(selectedValue);
                break;
            case "relatives":

                $rootScope.patientDetailsToBeDisplayed.historyTabState = 2;
                //console.log(selectedValue);
                break;
            case "lifestyle":

                $rootScope.patientDetailsToBeDisplayed.historyTabState = 3;
                if ($rootScope.patientDetailsToBeDisplayed.historyData[selectedValue])
                    $scope.specificLifeStyleSelection($rootScope.patientDetailsToBeDisplayed.historyData[selectedValue])
                //console.log(selectedValue);
                break;
            case "other":

                $rootScope.patientDetailsToBeDisplayed.historyTabState = 4;
                //console.log(selectedValue);
                break;
        }
        if (!$rootScope.patientDetailsToBeDisplayed.historyData[selectedValue]) {
            $scope.getHistoryValue(selectedValue);
        }
        else {
            $scope.historySelectedHeader.path = "templates/directives/patientDetailsPage/historyTabContents/" + selectedValue + "TabSelectionPage.html";
        }
    }

    $scope.specificLifeStyleSelection = function (data) {
        //console.log(data);
        var tempKeys = ["tobacco", "coffee", "alcohol", "recreationalDrugs", "counselling", "exercise", "hazardous"];
        for (i in tempKeys) {
            if (!$scope.historyLifestyleData[tempKeys[i]]) {
                $scope.historyLifestyleData[tempKeys[i]] = {
                    "Status": data.lifestyleHistory[tempKeys[i] + "Status"],
                    "QuitDate": data.lifestyleHistory[tempKeys[i] + "QuitDate"],
                    "Value": data.lifestyleHistory[tempKeys[i]]
                }
                //console.log(data.lifestyleHistory[tempKeys[i] + "QuitDate"]);
            }
        }
        $scope.historyLifestyleData["sleepPatterns"] = {
            "Status": "",
            "QuitDate": null,
            "Value": data.lifestyleHistory["sleepPatterns"]
        }
        $scope.historyLifestyleData["seatbeltUse"] = {
            "Status": "",
            "QuitDate": null,
            "Value": data.lifestyleHistory["seatbeltUse"]
        }
    }
    $scope.onHistoryDataReturned = function (data, status, headers, config) {
        $scope.historyData[$scope.selectedValue] = data;
        $rootScope.patientDetailsToBeDisplayed.historyData[$scope.selectedValue] = $scope.historyData[$scope.selectedValue];
        //console.log($rootScope.patientDetailsToBeDisplayed);
        if ($scope.selectedValue == "lifestyle") {
            $scope.specificLifeStyleSelection(data)
        }
        $scope.historySelectedHeader.path = "templates/directives/patientDetailsPage/historyTabContents/" + $scope.selectedValue + "TabSelectionPage.html";
        $scope.$parent.loaderGifClass.display = "none";
    }
    $scope.onHistoryDataError = function (data, status, headers, config) {
        $scope.urlRefesh = config.url;
        if (status == 401) {
            //console.log($localStorage.loginUrl);
            $http.get($localStorage.loginUrl).
            success(function (data, status, headers, config) {
                //console.log($scope.urlRefesh);
                $http.get($scope.urlRefesh).
                    success($scope.onHistoryDataReturned).
                    error($scope.onHistoryDataError);
            }).
            error(
            function (data, status, headers, config) {
                delete $localStorage.loginUrl;
                if (!$scope.dlg) {
                    $scope.dlg = dialogs.error('Connection expired!', ' You will be logged out!');
                    $scope.dlg.result.then(function (btn) {
                        //console.log($scope.dlg);
                        $scope.dlg = null;
                        $state.go('login');

                    });
                }

            }
            );
        }
        else {
            //$scope.patientsLoadedInfo = "Error reaching server. Please check your internet connection.";
            $scope.loaderGifClass.display = "none";
            delete $localStorage.loginUrl;
            if (!$scope.dlg) {
                $scope.dlg = dialogs.error('Unknown error when connecting to the server!', "There seems to be problem with your internet connection!\nCheck you connection and try again!");
                $scope.dlg.result.then(function (btn) {
                    //$state.go('login');
                    $scope.dlg = null;
                });
            }

        }
        $scope.loaderGifClass.display = "none";
        $scope.historySelectedHeader.path = "templates/directives/patientDetailsPage/historyTabContents/" + $scope.selectedValue + "TabSelectionPage.html";
    }
    $scope.getHistoryValue = function (selectedValue) {
        $scope.$parent.loaderGifClass.display = "block";
        if (selectedValue == "familyHistory")
            $scope.url = $rootScope.urls.patientFamilyHistoryUrl + $rootScope.patientDetailsToBeDisplayed.patientID;
        else
            $scope.url = $rootScope.urls.patientHistoryUrl + selectedValue + "/" + $rootScope.patientDetailsToBeDisplayed.patientID;

        $http.get($scope.url)
            .success($scope.onHistoryDataReturned)
            .error($scope.onHistoryDataError);
        //$rootScope.patientDetailsToBeDisplayed.historyData[selectedValue] = $scope.historyData[selectedValue];

    }
}]);



app.controller('vitalsPageSelectionCtrl', ['$scope', '$http', '$filter', '$rootScope', 'dialogs', '$localStorage', function ($scope, $http, $filter, $rootScope, dialogs, $localStorage) {
    //console.log("here");
    //console.log($rootScope.patientDetailsToBeDisplayed)
    $scope.earlyWarning = 0;
    $scope.secondHeader = "Unit";
    $scope.addNewVitals = function () {
        $scope.opts = {
            'size': 'sm',
            'windowClass': 'align-modal-dialog'
        };
        var dialogInstance = dialogs.create('templates/dialogs/uploadVitals.html', 'modalUploadVitalsController', {}, $scope.opts);
        dialogInstance.result.then(function (data) {
            //console.log($rootScope.patientDetailsToBeDisplayed.vitalsData);
            console.log(data.latestVitals);
            $rootScope.patientDetailsToBeDisplayed.latestVitals = data.latestVitals;
            $scope.setLatestValues();
            //console.log($rootScope.patientDetailsToBeDisplayed.vitalsData);
            function addToArryWithSameLength(a, obj) {
                var tempNew = new Array();
                tempNew.push(obj);
                for (i in a)
                    tempNew.push(a[i])
                tempNew.splice(-1, 1);

                return tempNew;
            }
            for(var i in data.graphData)
            {
                if ($rootScope.patientDetailsToBeDisplayed.vitalsData[i] != null)
                {
                    var tempArray = $rootScope.patientDetailsToBeDisplayed.vitalsData[i];
                    if (i == 'BP')
                    {
                        tempArray.data = addToArryWithSameLength(tempArray.data, {
                            bpd: data.graphData[i].bpd,
                            bps: data.graphData[i].bps,
                            date: data.latestVitals.date
                        });
                    }
                    else
                    {
                        tempArray.data = addToArryWithSameLength(tempArray.data, {
                            value: data.graphData[i],
                            date: data.latestVitals.date
                        });
                    }
                    $rootScope.patientDetailsToBeDisplayed.vitalsData[i] = tempArray;
                    $scope.setGraphData();
                    //console.log($rootScope.patientDetailsToBeDisplayed.vitalsData[i]);
                }
            }
        });
    }

    $scope.chartConfig = {
        title: {
            text: 'Blood Pressure'
        },
        options: {
            chart: {
                type: 'line'
            }
        },
        series: [{
            name: 'BP Systolic',
            data: []
        }],

        xAxis: {
            categories: []
        },
        yAxis: {
            title: {
                text: 'Blood Pressure'
            }
        }
    }


    $scope.sections = [
        {
            name: "Weight",
            type: "WT",
            twu: "WTL",
            unit: "lbs",
            values: "lbs"
        },
        {
            name: "Weight",
            type: "WT",
            twu: "WTK",
            unit: "kg",
            values: "kg"
        },
        {
            name: "Height",
            type: "HT",
            twu: "HTI",
            unit: "in",
            values: "in"
        },
        {
            name: "Height",
            type: "HT",
            twu: "HTC",
            unit: "cm",
            values: "cm"
        },
        {
            name: "BP Systolic",
            type: "BP",
            twu: "BPS",
            unit: "mmHg",
            values: "mmHg"
        },
        {
            name: "BP Diastolic",
            type: "BP",
            twu: "BPD",
            unit: "mmHg",
            values: "mmHg"
        },
        {
            name: "Pulse",
            type: "HR",
            twu: "HR",
            unit: "per min",
            values: "per min"
        },
        {
            name: "Respiration",
            type: "RP",
            twu: "RP",
            unit: "per min",
            values: "per min"
        },
        {
            name: "Temprature",
            type: "TP",
            twu: "TPF",
            unit: "F",
            values: "F"
        },
        {
            name: "Temprature",
            type: "TP",
            twu: "TPC",
            unit: "C",
            values: "C"
        },
        {
            name: "Temp Location",
            type: null,
            twu: null,
            unit: "",
            values: ""
        },
        {
            name: "Oxygen",
            type: "os",
            twu: "os",
            unit: "%",
            values: "Saturation"
        },
        {
            name: "Head Circumference",
            type: "HC",
            twu: "HCI",
            unit: "in",
            values: "in"
        },
        {
            name: "Head Circumference",
            type: "HC",
            twu: "HCC",
            unit: "cm",
            values: "cm"
        },
        {
            name: "Waist Circumference",
            type: "WC",
            twu: "WCC",
            unit: "cm",
            values: "cm"
        },
        {
            name: "Waist Circumference",
            type: "WC",
            twu: "WCI",
            unit: "in",
            values: "in"
        },
        {
            name: "BMI",
            type: "BM",
            twu: "BM",
            unit: "kg/m^2",
            values: "kg/m^2"
        },
    ];
    $scope.calculateEWS = function () {
        var latestVitals = $rootScope.patientDetailsToBeDisplayed.latestVitals;
        $scope.earlyWarning = 0;
        var ews = { "bps": 0, "respiration": 0, "pulse": 0, "temperature": 0, "consciousness": 0 };
        if (latestVitals["bps"] !== undefined && latestVitals["bps"] !== "") {
            if (latestVitals["bps"] <= 60.5 && latestVitals["bps"] >= 159.5)
                ews["bps"] = 3;
            else if ((latestVitals["bps"] > 60.5 && latestVitals["bps"] <= 77) || (latestVitals["bps"] >= 143 && latestVitals["bps"] < 159.5))
                ews["bps"] = 2;
            else if ((latestVitals["bps"] > 77 && latestVitals["bps"] <= 93.5) || (latestVitals["bps"] >= 126.5 && latestVitals["bps"] < 143))
                ews["bps"] = 1;
            else if (latestVitals["bps"] > 93.5 && latestVitals["bps"] < 126.5)
                ews["bps"] = 0;

        }

        if (latestVitals["pulse"] !== undefined && latestVitals["pulse"] !== "") {
            if (latestVitals["pulse"] >= 130)
                ews["pulse"] = 3;
            else if ((latestVitals["pulse"] <= 40) || ((latestVitals["pulse"] >= 111) && (latestVitals["pulse"] <= 129)))
                ews["pulse"] = 2;
            else if (((latestVitals["pulse"] >= 41) && (latestVitals["pulse"] <= 50)) || ((latestVitals["pulse"] >= 101) && (latestVitals["pulse"] <= 110)))
                ews["pulse"] = 1;
            else if (latestVitals["pulse"] >= 51 && latestVitals["pulse"] <= 100)
                ews["pulse"] = 0;
        }
        if (latestVitals["respiration"] !== undefined && latestVitals["respiration"] !== "") {
            if (latestVitals["respiration"] >= 30)
                ews["respiration"] = 3;
            else if (latestVitals["respiration"] < 9 || ((latestVitals["respiration"] >= 21) && (latestVitals["respiration"] <= 29)))
                ews["respiration"] = 2;
            else if (latestVitals["respiration"] >= 15 && latestVitals["respiration"] <= 20)
                ews["respiration"] = 1;
            else if (latestVitals["respiration"] >= 9 && latestVitals["respiration"] <= 14)
                ews["respiration"] = 0;
        }
        if (latestVitals["temperature"] !== undefined && latestVitals["temperature"] !== "") {
            var temp = latestVitals["temperature"];
            if (temp < 35 || temp >= 38.5)
                ews["temperature"] = 2;
            else if (temp >= 35 && temp <= 38.4)
                ews["temperature"] = 0;
        }

        $scope.earlyWarning = ews["bps"] + ews["pulse"] + ews["respiration"] + ews["temperature"] + ews["consciousness"];
    }
    //console.log($scope.temp);
    $scope.onFinishedLoadingSelectedVitalsData = function (data, status, headers, config) {
        //console.log(data);
        if (data["latestvitals"]) {
            //console.log(data);
            $rootScope.patientDetailsToBeDisplayed.latestVitals = data["latestvitals"];
            $scope.tempDate = new Date($rootScope.patientDetailsToBeDisplayed.latestVitals.date);
            $scope.secondHeader = $filter('date')($scope.tempDate, "MM-dd-yyyy")
            $scope.setLatestValues();
        }
        else {
            $rootScope.patientDetailsToBeDisplayed.vitalsData[$scope.selected.type] = data;
            $scope.setGraphData();
        }

        if ($rootScope.patientDetailsToBeDisplayed.latestVitals && $rootScope.patientDetailsToBeDisplayed.vitalsData[$scope.selected.type]) {
            $scope.$parent.loaderGifClass.display = "none";
        }
    }

    $scope.onErrorLoadingSelectedVitalsData = function (data, status, headers, config) {
        //console.log("data loading error");
        $scope.urlRefesh = config.url;
        if (status == 401) {
            //console.log($localStorage.loginUrl);
            $http.get($localStorage.loginUrl).
            success(function (data, status, headers, config) {
                //console.log($scope.urlRefesh);
                $http.get($scope.urlRefesh).
                    success($scope.onFinishedLoadingSelectedVitalsData).
                    error($scope.onErrorLoadingSelectedVitalsData);
            }).
            error(
            function (data, status, headers, config) {
                delete $localStorage.loginUrl;
                if (!$scope.dlg1) {
                    $scope.dlg1 = dialogs.error('Connection expired! You will be logged out.');
                    $scope.dlg1.result.then(function (btn) {
                        //console.log($scope.dlg);
                        $scope.dlg = null;

                        $state.go('login');
                    });
                }

            }
            );
        }
        else {
            //$scope.patientsLoadedInfo = "Error reaching server. Please check your internet connection.";
            $scope.$parent.loaderGifClass.display = "none";
            delete $localStorage.loginUrl;
            if (!$scope.dlg1) {
                $scope.dlg1 = dialogs.error('Unknown error when connecting to the server!', "There seems to be problem with your internet connection!\nCheck you connection and try again!");
                $scope.dlg1.result.then(function (btn) {
                    $scope.dlg = null;
                    //$state.go('login');
                });
            }

        }
        $scope.$parent.loaderGifClass.display = "none";
    }

    $scope.myParseFloat = function (data) {
        if (data)
            return parseFloat(data);
        else
            return 0;
    }

    $scope.setLatestValues = function () {
        $scope.sections[0].values = $scope.myParseFloat($rootScope.patientDetailsToBeDisplayed.latestVitals["weight"]) + " lbs";
        $scope.sections[1].values = ($scope.myParseFloat($rootScope.patientDetailsToBeDisplayed.latestVitals["weight"]) * 0.45359237) + " kg";
        $scope.sections[2].values = $scope.myParseFloat($rootScope.patientDetailsToBeDisplayed.latestVitals["height"]) + " in";
        $scope.sections[3].values = ($scope.myParseFloat($rootScope.patientDetailsToBeDisplayed.latestVitals["height"]) * 2.54) + " cm";
        $scope.sections[4].values = $scope.myParseFloat($rootScope.patientDetailsToBeDisplayed.latestVitals["bps"]) + " mmHg";
        $scope.sections[5].values = $scope.myParseFloat($rootScope.patientDetailsToBeDisplayed.latestVitals["bpd"]) + " mmHg";
        $scope.sections[6].values = $scope.myParseFloat($rootScope.patientDetailsToBeDisplayed.latestVitals["pulse"]) + " per min";
        $scope.sections[7].values = $scope.myParseFloat($rootScope.patientDetailsToBeDisplayed.latestVitals["respiration"]) + " per min";
        $scope.sections[8].values = $scope.myParseFloat($rootScope.patientDetailsToBeDisplayed.latestVitals["temperature"]) + " F";
        $scope.sections[9].values = (($scope.myParseFloat($rootScope.patientDetailsToBeDisplayed.latestVitals["temperature"]) - 32) * (5 / 9)) + " C";
        $scope.sections[11].values = $scope.myParseFloat($rootScope.patientDetailsToBeDisplayed.latestVitals["oxygenSaturaton"]) + " %";
        $scope.sections[12].values = $scope.myParseFloat($rootScope.patientDetailsToBeDisplayed.latestVitals["headCirculation"]) + " in";
        $scope.sections[13].values = ($scope.myParseFloat($rootScope.patientDetailsToBeDisplayed.latestVitals["headCirculation"]) * 0.45359237) + " cm";
        $scope.sections[14].values = ($scope.myParseFloat($rootScope.patientDetailsToBeDisplayed.latestVitals["waistCirculation"]) * 0.45359237) + " cm";
        $scope.sections[15].values = $scope.myParseFloat($rootScope.patientDetailsToBeDisplayed.latestVitals["waistCirculation"]) + " in";
        $scope.sections[16].values = $scope.myParseFloat($rootScope.patientDetailsToBeDisplayed.latestVitals["bmi"]) + " kg/m^2";
        $scope.calculateEWS();
    }

    if (!$rootScope.patientDetailsToBeDisplayed.latestVitals) {
        $http.get($rootScope.urls.patientVitalsUrl + $rootScope.patientDetailsToBeDisplayed.patientID)
            .success($scope.onFinishedLoadingSelectedVitalsData)
            .error($scope.onErrorLoadingSelectedVitalsData);
    }
    else {
        $scope.setLatestValues();
    }

    

    $scope.currentDate = new Date();
    $scope.prevDate = new Date($scope.currentDate.getFullYear() - 1, $scope.currentDate.getMonth(), $scope.currentDate.getDate());
    $scope.setMaster = function (section) {
        //console.log(section);
        if (section.type && section.twu != $scope.selected.twu) {
            $scope.selected = section;
            if (!$rootScope.patientDetailsToBeDisplayed.vitalsData[section.type]) {
                /*$scope.url = $rootScope.urls.patientViltalDetailsUrl +
                    section.type + "/" + $filter('date')($scope.prevDate, "MM-dd-yyyy") +
                    "/" + $filter('date')($scope.currentDate, "MM-dd-yyyy")
                    + "/" + $rootScope.patientDetailsToBeDisplayed.patientID;*/
                $scope.url = $rootScope.urls.patientViltalDetailsUrl + section.type + "/" + 12 + "/" + $rootScope.patientDetailsToBeDisplayed.patientID;
                //console.log($scope.url);
                $http.get($scope.url)
                    .success($scope.onFinishedLoadingSelectedVitalsData)
                    .error($scope.onErrorLoadingSelectedVitalsData);

                $scope.$parent.loaderGifClass.display = "block";
            }
            else {
                $scope.setGraphData();
            }
        }
    }

    $scope.isSelected = function (section) {
        return $scope.selected === section;
    }


    $scope.selected = { name: "BP Diastolic", type: "BP", twu: "BPD", unit: "mmHg", $$hashKey: "01D" };

    $scope.setGraphData = function () {
        try {
            $scope.dataLength = $rootScope.patientDetailsToBeDisplayed.vitalsData[$scope.selected.type].data.length;
        } catch (e) {
            $scope.dataLength = 0
        }
        switch ($scope.selected.type) {
            case "BP":

                $scope.chartConfig.title.text = "Blood Pressure" + " (" + $scope.selected.unit + ")";
                $scope.chartConfig.xAxis.categories = [];
                $scope.chartConfig.series = [];
                $scope.chartConfig.yAxis.title.text = "Blood Pressure" + " (" + $scope.selected.unit + ")";
                $scope.chartConfig.series.push({
                    name: "BP Systolic",
                    data: []
                });
                $scope.chartConfig.series.push({
                    name: "BP Diastolic",
                    data: []
                });
                for (var i = 0 ; i < $scope.dataLength; i++) {
                    if ($rootScope.patientDetailsToBeDisplayed.vitalsData[$scope.selected.type].data[i].bps != null && $rootScope.patientDetailsToBeDisplayed.vitalsData[$scope.selected.type].data[i].bpd != null) {
                        $scope.tempDate = new Date($rootScope.patientDetailsToBeDisplayed.vitalsData[$scope.selected.type].data[i].date);
                        //console.log($rootScope.patientDetailsToBeDisplayed.vitalsData[$scope.selected.type].bloodPressureData[i].date);
                        $scope.chartConfig.xAxis.categories.push($filter('date')($scope.tempDate, "MM-dd-yyyy") + "       ");

                        $scope.chartConfig.series[0].data.push($scope.myParseFloat($rootScope.patientDetailsToBeDisplayed.vitalsData[$scope.selected.type].data[i].bps));
                        $scope.chartConfig.series[1].data.push($scope.myParseFloat($rootScope.patientDetailsToBeDisplayed.vitalsData[$scope.selected.type].data[i].bpd));
                    }
                }
                //console.log($scope.chartConfig.xAxis.categories);
                break;
            default:

                $scope.chartConfig.title.text = $scope.selected.name + " (" + $scope.selected.unit + ")";;
                $scope.chartConfig.xAxis.categories = [];
                $scope.chartConfig.series = [];
                $scope.chartConfig.yAxis.title.text = $scope.selected.name + " (" + $scope.selected.unit + ")";
                $scope.chartConfig.series.push({
                    name: $scope.selected.name,
                    data: []
                });
                switch ($scope.selected.twu) {
                    case "WTK":
                        for (var i = 0 ; i < $scope.dataLength; i++) {
                            if ($rootScope.patientDetailsToBeDisplayed.vitalsData[$scope.selected.type].data[i].value != null) {
                                $scope.tempDate = new Date($rootScope.patientDetailsToBeDisplayed.vitalsData[$scope.selected.type].data[i].date);
                                $scope.chartConfig.xAxis.categories.push($filter('date')($scope.tempDate, "MM-dd-yyyy"));

                                $scope.chartConfig.series[0].data.push($scope.myParseFloat($rootScope.patientDetailsToBeDisplayed.vitalsData[$scope.selected.type].data[i].value) * 0.45359237);
                            }
                        }
                        break;
                    case "HTC":
                    case "WCC":
                    case "HCC":
                        for (var i = 0 ; i < $scope.dataLength; i++) {
                            if ($rootScope.patientDetailsToBeDisplayed.vitalsData[$scope.selected.type].data[i].value != null) {
                                $scope.tempDate = new Date($rootScope.patientDetailsToBeDisplayed.vitalsData[$scope.selected.type].data[i].date);
                                $scope.chartConfig.xAxis.categories.push($filter('date')($scope.tempDate, "MM-dd-yyyy"));

                                $scope.chartConfig.series[0].data.push($scope.myParseFloat($rootScope.patientDetailsToBeDisplayed.vitalsData[$scope.selected.type].data[i].value) * 2.54);
                            }
                        }
                        break;
                    case "TPC":
                        for (var i = 0 ; i < $scope.dataLength; i++) {
                            if ($rootScope.patientDetailsToBeDisplayed.vitalsData[$scope.selected.type].data[i].value != null) {
                                $scope.tempDate = new Date($rootScope.patientDetailsToBeDisplayed.vitalsData[$scope.selected.type].data[i].date);
                                $scope.chartConfig.xAxis.categories.push($filter('date')($scope.tempDate, "MM-dd-yyyy"));

                                $scope.chartConfig.series[0].data.push(($scope.myParseFloat($rootScope.patientDetailsToBeDisplayed.vitalsData[$scope.selected.type].data[i].value) - 32) * (5 / 9));
                            }
                        }
                        break;
                    default:
                        for (var i = 0 ; i < $scope.dataLength; i++) {
                            if ($rootScope.patientDetailsToBeDisplayed.vitalsData[$scope.selected.type].data[i].value != null) {
                                $scope.tempDate = new Date($rootScope.patientDetailsToBeDisplayed.vitalsData[$scope.selected.type].data[i].date);
                                $scope.chartConfig.xAxis.categories.push($filter('date')($scope.tempDate, "MM-dd-yyyy"));

                                $scope.chartConfig.series[0].data.push($scope.myParseFloat($rootScope.patientDetailsToBeDisplayed.vitalsData[$scope.selected.type].data[i].value));
                            }
                        }
                        break;
                }

                //console.log($rootScope.patientDetailsToBeDisplayed.vitalsData[$scope.selected.type].data);
                break;
        }

        if ($scope.dataLength == 0) {
            $scope.$parent.loaderGifClass.display = "none";
        }

    }
    $scope.setMaster({ name: "BP Systolic", type: "BP", twu: "BPS", unit: "mmHg", $$hashKey: "01D" });

    //console.log($rootScope.patientDetailsToBeDisplayed);
}]);


app.controller('medicalHistoryController', ['$scope', '$http', '$filter', '$localStorage', 'dialogs', '$rootScope', function ($scope, $http, $filter, $localStorage, dialogs, $rootScope) {
    $scope.medicalHistory = $rootScope.patientDetailsToBeDisplayed.medicalHistory;
    $scope.encounters = $rootScope.patientDetailsToBeDisplayed.encounters;
    $scope.onMedicalHistorySuccess = function (data, status, headers, config) {
        if (data["medication"]) {
            for (var i = 0; i < data["medication"].length; i++) {
                $scope.encounters[data["medication"][i].medicationName] = "null";
            }
            $scope.medicalHistory.medication = data["medication"];
        }
        else if (data["allergies"]) {
            for (var i = 0; i < data["allergies"].length; i++) {
                $scope.encounters[data["allergies"][i].allergyName] = "null";
            }
            $scope.medicalHistory.allergies = data["allergies"];
        }
        else if (data["medical"]) {
            for (var i = 0; i < data["medical"].length; i++) {
                $scope.encounters[data["medical"][i].medicalIssueName] = "null";
            }
            $scope.medicalHistory.medicalProblems = data["medical"];
            //console.log($scope.medicalHistory.medicalProblems);

        }
        else if (data["surgeries"]) {
            for (var i = 0; i < data["surgeries"].length; i++) {
                $scope.encounters[data["surgeries"][i].surgeryName] = "null";
            }
            $scope.medicalHistory.surgeries = data["surgeries"];
        }
        else if (data["dentals"]) {
            for (var i = 0; i < data["dentals"].length; i++) {
                $scope.encounters[data["dentals"][i].dentalName] = "null";
            }
            $scope.medicalHistory.dentalIssues = data["dentals"];
        }
        else if (data["immunizations"]) {
            $scope.medicalHistory.immunization = data["immunizations"];
        }
        else if (data["prescriptions"]) {
            $scope.medicalHistory.prescriptions = data["prescriptions"];
        }
        $rootScope.patientDetailsToBeDisplayed.medicalHistory = $scope.medicalHistory;
        $rootScope.patientDetailsToBeDisplayed.encounters = $scope.encounters;
    }

    $scope.onEncountersClicked = function (values) {
        $scope.onEncounterSuccess = function (data, status, headers, config) {
            $scope.encounters[values] = data["encounters"];
        }

        if ($scope.encounters[values] == "null")
            $http.get($rootScope.urls.patientIssuesUrl + $rootScope.patientDetailsToBeDisplayed.patientID + "/" + values)
                .success($scope.onEncounterSuccess)
                .error($scope.onMedicalHistoryError);

    }
    $scope.onMedicalHistoryError = function (data, status, headers, config) {
        $scope.urlRefesh = config.url;
        if (status == 401) {
            //console.log($localStorage.loginUrl);
            $http.get($localStorage.loginUrl).
            success(function (data, status, headers, config) {
                //console.log($scope.urlRefesh);
                $http.get($scope.urlRefesh).
                    success($scope.onFinishedLoadingSelectedVitalsData).
                    error($scope.onErrorLoadingSelectedVitalsData);
            }).
            error(
            function (data, status, headers, config) {
                delete $localStorage.loginUrl;
                if (!$scope.dlg1) {
                    $scope.dlg1 = dialogs.error('Connection expired! You will be logged out.');
                    $scope.dlg1.result.then(function (btn) {
                        //console.log($scope.dlg);
                        $scope.dlg = null;

                        $state.go('login');
                    });
                }

            }
            );
        }
        else {
            //$scope.patientsLoadedInfo = "Error reaching server. Please check your internet connection.";
            $scope.$parent.loaderGifClass.display = "none";
            delete $localStorage.loginUrl;
            if (!$scope.dlg1) {
                $scope.dlg1 = dialogs.error('Unknown error when connecting to the server!', "There seems to be problem with your internet connection!\nCheck you connection and try again!");
                $scope.dlg1.result.then(function (btn) {
                    $scope.dlg = null;
                    //$state.go('login');
                });
            }

        }
    }
    if (!$scope.medicalHistory.medication) {
        $scope.url = $rootScope.urls.patientMedicationUrl + $rootScope.patientDetailsToBeDisplayed.patientID;
        $http.get($scope.url)
            .success($scope.onMedicalHistorySuccess)
            .error($scope.onMedicalHistoryError);
    }
    for (var i = 0; i < $scope.medicalHistory.allergies.length; i++) {
        $scope.encounters[$scope.medicalHistory.allergies[i].allergyName] = "null";
    }
    if (!$scope.medicalHistory.allergies) {
        $scope.url = $rootScope.urls.patientAllergiesUrl + $rootScope.patientDetailsToBeDisplayed.patientID;
        $http.get($scope.url)
             .success($scope.onMedicalHistorySuccess)
             .error($scope.onMedicalHistoryError);
    }
    if (!$scope.medicalHistory.medicalProblems) {
        $scope.url = $rootScope.urls.patientMedicalsUrl + $rootScope.patientDetailsToBeDisplayed.patientID;
        $http.get($scope.url)
             .success($scope.onMedicalHistorySuccess)
             .error($scope.onMedicalHistoryError);
    }
    if (!$scope.medicalHistory.immunization) {
        $scope.url = $rootScope.urls.patientImmunizationUrl + $rootScope.patientDetailsToBeDisplayed.patientID;
        $http.get($scope.url)
             .success($scope.onMedicalHistorySuccess)
             .error($scope.onMedicalHistoryError);
    }
    if (!$scope.medicalHistory.prescriptions) {
        $scope.url = $rootScope.urls.patientPriscriptionUrl + $rootScope.patientDetailsToBeDisplayed.patientID;
        $http.get($scope.url)
             .success($scope.onMedicalHistorySuccess)
             .error($scope.onMedicalHistoryError);
    }
    if (!$scope.medicalHistory.surgeries) {
        $scope.url = $rootScope.urls.patientSurgeriesUrl + $rootScope.patientDetailsToBeDisplayed.patientID;
        $http.get($scope.url)
             .success($scope.onMedicalHistorySuccess)
             .error($scope.onMedicalHistoryError);
    }

    if (!$scope.medicalHistory.dentalIssues) {
        $scope.url = $rootScope.urls.patientDentalIssuesUrl + $rootScope.patientDetailsToBeDisplayed.patientID;
        $http.get($scope.url)
             .success($scope.onMedicalHistorySuccess)
             .error($scope.onMedicalHistoryError);
    }


    $scope.inside = [
    ];
    $scope.discText = {
        appoinementDisc: "5/28/2015, 9:30 AM I AMCARE CLINIC, LAKEHORE DRIVE",
        medicationDisc: "IN PROGRESS APLOSYN, 2x/DAY, AM AND PM",
        immunizationDisc: "SCHEDULED DTP - 5/29/2015, ADENOVIRUS - 5/30/2015"
    };



}]);

app.controller('selectAppointmentCtrl', ['$scope', '$filter', '$state', '$stateParams', '$http', '$rootScope', '$localStorage', 'dialogs', 'sqlCypherDb', function ($scope, $filter, $state, $stateParams, $http, $rootScope, $localStorage, dialogs, sqlCypherDb) {
    $scope.buttonTitle = "UPDATE LIST";
    $scope.onAppointmentsDataLoaded = function (data, status, headers, config) {
        $scope.filterAppointments = [];
        //console.log(data);
        $scope.$parent.loaderGifClass.display = "none";
        for (var i = 0; i < data["Appointments"].length; i++) {
            $scope.filterAppointments.push({
                "name": data["Appointments"][i].patient.title + " " + data["Appointments"][i].patient.firstName + " " + data["Appointments"][i].patient.lastName,
                "reason": data["Appointments"][i].title,
                "startTime": data["Appointments"][i].scheduleStartTime,
                "patientID": data["Appointments"][i].patient.id
            });
            $rootScope.patientSearchState.appointmentsData = $scope.filterAppointments;
        }
    }
    $scope.onAppointmentsDataError = function (data, status, headers, config) {
        $scope.urlRefesh = config.url;
        if (status == 401) {
            //console.log($localStorage.loginUrl);
            $http.get($localStorage.loginUrl).
            success(function (data, status, headers, config) {
                //console.log($scope.urlRefesh);
                $http.get($scope.urlRefesh).
                    success($scope.onFinishedLoadingSelectedVitalsData).
                    error($scope.onErrorLoadingSelectedVitalsData);
            }).
            error(
            function (data, status, headers, config) {
                delete $localStorage.loginUrl;
                if (!$scope.dlg1) {
                    $scope.dlg1 = dialogs.error('Connection expired! You will be logged out.');
                    $scope.dlg1.result.then(function (btn) {
                        //console.log($scope.dlg);
                        $scope.dlg = null;

                        $state.go('login');
                    });
                }

            }
            );
        }
        else {
            //$scope.patientsLoadedInfo = "Error reaching server. Please check your internet connection.";
            $scope.$parent.loaderGifClass.display = "none";
            delete $localStorage.loginUrl;
            if (!$scope.dlg1) {
                $scope.dlg1 = dialogs.error('Unknown error when connecting to the server!', "There seems to be problem with your internet connection!\nCheck you connection and try again!");
                $scope.dlg1.result.then(function (btn) {
                    $scope.dlg = null;
                    //$state.go('login');
                });
            }

        }
    }
    $scope.onUpdateButtonClicked = function () {
        $scope.$parent.loaderGifClass.display = "block";
        $http.get($rootScope.urls.patientAppointmentOnDateUrl + $filter('date')($scope.selectedDate, 'MM-dd-yyyy'))
        .success($scope.onAppointmentsDataLoaded)
        .error($scope.onAppointmentsDataError);
    }
    $scope.filterAppointments = $rootScope.patientSearchState.appointmentsData;//$stateParams.patientListData.dataApointments;

    $scope.providerType = ["All Providers", "Administrator", "nurse nurse", "walt white"];
    $scope.providerFilter = $scope.providerType[0];
    $scope.providerSelectionChanged = function (choice) {
        $scope.providerFilter = choice;
    }

    $scope.selectedDate = new Date();//$filter('date')(new Date, 'MMM d, y');

    $scope.onPatientClicker = function (patientClicker) {
        $scope.patientSelected = $stateParams.patientDetailsObject;
        $scope.patientSelected.patientID = patientClicker.patientID;
        $rootScope.patientDetailsToBeDisplayed = $scope.patientSelected;
        if ($rootScope.onlineLogin == false || $localStorage.lastDbSync)
        {
            sqlCypherDb.selectFromTable('patientDetails', '*', "patientID = " + patientClicker.patientID).then(function (result) {
                var tempPatient = result.item(0);
                $rootScope.patientDetailsToBeDisplayed = JSON.parse(tempPatient.patientDetailsData);
                console.log(JSON.parse(tempPatient.patientDetailsData));
                $state.go('patientDetails', {
                    patientListData: {
                        data: [],
                        dataApointments: $scope.filterAppointments
                    },
                    patientDetailsObject: $scope.patientSelected
                });
            });
        }
        else
        {
            $state.go('patientDetails', {
                patientListData: {
                    data: [],
                    dataApointments: $scope.filterAppointments
                },
                patientDetailsObject: null
            });
        }
    }
    if ($scope.filterAppointments.length == 0) {
        //console.log($scope.filterAppointments)

        $scope.onUpdateButtonClicked();

    }
}]);

app.controller('loadingGifController', ['$scope', '$modalInstance', 'data', function ($scope, $modalInstance, data) {
    //console.log(data);
    $scope.message = data["message"];
    $scope.done = function () {
        $modalInstance.dismiss('canceled');
    }
}]);

app.controller('addPatientCtrl', ['$scope', '$http', '$filter', '$rootScope', 'dialogs', '$localStorage', function ($scope, $http, $filter, $rootScope, dialogs, $localStorage) {
    $scope.$watch('addPatient', function (newValue, oldVAlue) {
        var tempcurrent = 0;
        for (i in newValue) {
            if (i != "contents" && i != "addPatientDates") {
                //console.log(newValue[i]);
                tempcurrent = 0;
                for (j in newValue[i]) {
                    if (newValue[i][j] != "" && newValue[i][j] != undefined && newValue[i][j] != "Unassigned") {
                        tempcurrent++;
                    }
                }
                $scope.roundProgressBarSpecs[i].current = tempcurrent;
            }

            //console.log($scope.addPatient["who"].firstName);
            if ($scope.addPatient["who"].firstName != "" && $scope.addPatient["who"].lastName != "" && $scope.addPatient["who"].firstName != undefined && $scope.addPatient["who"].lastName != undefined) {
                $scope.message = "";
                $scope.addPatient.contents.saveButtonDisabled = false;
            }
            else {
                $scope.message = '';
                if ($scope.addPatient["who"].firstName == "" || $scope.addPatient["who"].firstName == undefined) {
                    $scope.message = "First Name, ";
                }

                if ($scope.addPatient["who"].lastName == "" || $scope.addPatient["who"].lastName == undefined) {
                    $scope.message += "Last Name ";
                }
                $scope.addPatient.contents.saveButtonDisabled = true;
                $scope.message += " are mandatory.";
            }

        }

    }, true);
    $scope.message = "";
    $scope.roundProgressBarSpecs = {
        who: {
            max: 14,
            current: 0
        },
        contact1: {
            max: 8,
            current: 0
        },
        contact2: {
            max: 5,
            current: 0
        },
        choices: {
            max: 13,
            current: 12
        },
        employer: {
            max: 7,
            current: 0
        },
        statistics: {
            max: 11,
            current: 1
        },
        miscellaneous: {
            max: 2,
            current: 1
        },
        insurance1: {
            max: 10,
            current: 3
        },
        insurance2: {
            max: 7,
            current: 0
        },
        insurance3: {
            max: 6,
            current: 1
        },
    };
    $scope.max = 20;
    $scope.current = 0;

    $scope.addPatient = {
        contents: {
            saveButtonDisabled: true,
            sexType: ["Mr.", "Ms.", "Mrs.", "Dr."],
            maritalType: ["Married", "Single", "Divorced", "Widowed", "Separated", "Domestic Partner"],
            contact1StateType: $rootScope.patientSearchState.addPatientData.states,//{"SE": ["sdasd","sdsad"], "EU": ["asdsad", "sdasdas", "dasdsas"]},
            countryType: $rootScope.patientSearchState.addPatientData.countries,//["SE", "EU"],
            choiceProviderType: $rootScope.patientSearchState.addPatientData.providers,
            choiceRefProviderType: $rootScope.patientSearchState.addPatientData.providers,
            choicePharmacyType: $rootScope.patientSearchState.addPatientData.pharmacies,
            employerStateType: $rootScope.patientSearchState.addPatientData.states,//{ "SE": ["sdasd", "sdsad"], "EU": ["asdsad", "sdasdas", "dasdsas"] },
            insurance2StateType: $rootScope.patientSearchState.addPatientData.states,//{ "SE": ["sdasd", "sdsad"], "EU": ["asdsad", "sdasdas", "dasdsas"] },
            insurance3StateType: $rootScope.patientSearchState.addPatientData.states,//{ "SE": ["sdasd", "sdsad"], "EU": ["asdsad", "sdasdas", "dasdsas"] },
            insuranceProviderType: ["blarg insurance"],
            relationshipType: ["Chlid", "Spouse", "Self", "Other"],
            languageType: $rootScope.patientSearchState.addPatientData.language,
            ethnicityType: ["Hispanic or Latino", "Not Hispanic or Latino"],
            raceType: ["Decline to specify", "American indian", "Alaska Native", "Asian", "Black or Affrican Amarican", "Native Hawaiian or Other Passific Islander", "White"],
            referralSourceType: $rootScope.patientSearchState.addPatientData.referralSources,
            vfcType: ["Eligible", "Ineligible"],
            filterPatientFirstName: "First Name",
            filterPatientMiddleName: "Middle Name",
            filterPatientLastName: "Last Name",
            btnTitle: "SAVE"
        },
        who: {
            sexFilter: "Unassigned",
            firstName: "",
            middleName: "",
            lastName: "",
            patientSex: "Unassigned",
            maritalFilter: "Unassigned",
            ss: "",
            licenseId: "",
            externalId: "",
            userDefined1: "",
            userDefined2: "",
            userDefined3: "",
            userDefined4: "",
            dob: new Date()
        },
        addPatientDates: {
            'dob': new Date(),
            'stats': new Date(),
            'misc': new Date(),
            'iEfsDate': new Date(),
            'iDOB': new Date()
        },
        contact1: {
            address: "",
            city: "",
            postalCode: "",
            motherName: "",
            guardianName: "",
            emergencyContact: "",
            contact1StateFilter: "Unassigned",
            contact1CountryFilter: "Unassigned",
        },
        contact2: {
            emergencyPhone: "",
            homePhone: "",
            workPhone: "",
            mobilePhone: "",
            contactEmail: "",
        },
        choices: {
            choiceProviderFilter: "Unassigned",
            choiceRefProviderFilter: "Unassigned",
            choicePharmacyFilter: "Unassigned",
            hippaNotice: "",
            voiceMessage: "",
            mailMessage: "",
            sms: "",
            email: "",
            registry: "",
            healthInfo: "",
            info: "",
            patientPortal: "",
            leaveMessage: ""
        },
        employer: {
            occupation: "",
            employerName: "",
            employerAddress: "",
            employerCity: "",
            employerPostalCode: "",
            employerStateFilter: "Unassigned",
            employerCountryFilter: "Unassigned",
        },
        statistics: {
            languageFilter: "Unassigned",
            ethnicityFilter: "Unassigned",
            raceFilter: "Unassigned",
            referralSourceFilter: "Unassigned",
            vfcFilter: "Unassigned",
            stats: new Date(),
            familySize: "",
            monthlyIncome: "",
            employerHomeless: "",
            interpreter: "",
            employerMigrant: "",
        },
        miscellaneous: {
            misc: new Date(),
            rDeceseased: "",
        },
        insurance1: {
            insuranceProviderFilter: "Unassigned",
            planName: "",
            insuranceRank: "",
            policyNumber: "",
            groupNumber: "",
            insuranceSS: "",
            InsuranceSex: "Unassigned",
            relationshipFilter: "",
            iEfsDate: new Date()
        },
        insurance2: {
            subscriberAddress: "",
            subscriberCity: "",
            subscriberPostalCode: "",
            subscriberPhone: "",
            subscriberEmployer: "",
            insurance2StateFilter: "Unassigned",
            insurance2CountryFilter: "Unassigned"
        },
        insurance3: {
            seseAddress: "",
            seseCity: "",
            sesePostalCode: "",
            insurance3CountryFilter: "Unassigned",
            insurance3StateFilter: "Unassigned",
            assignment: "Yes"
        }

    };

    $scope.status = {
        openWho: false,
        openContact1: false,
        openContact2: false,
        openChoices: false,
        openEmployer: false,
        openStatistics: false,
        openMiscellaneous: false,
        openInsurance1: false,
        openInsurance2: false,
        openInsurance3: false,
        openSex: false,
        openMaritalStatus: false,
        openStateContact1: false,
        openCountryContact1: false,
        openProviderChoice: false,
        openRefProviderChoice: false,
        openPharmacyProviderChoice: false,
        openStateEmployer: false,
        openEmployerCountry: false

    }

    $scope.onStateTextBoxChanged = function (type) {
        $scope.status[type] = true;
    }

    $scope.startsWith = function (state, viewValue) {
        console.log(state, viewValue)
        return state.substr(0, viewValue.length).toLowerCase() == viewValue.toLowerCase();
    }

    $scope.titleSelectionChanged = function (choice, filter, acrType) {
        $scope.addPatient[acrType][filter] = choice;
    }

    $scope.titleCountrySelectionChanged = function (choice, filter, stateFilter, acrType) {
        if (choice != $scope.addPatient[acrType][filter]) {
            $scope.addPatient[acrType][filter] = choice;

            $scope.addPatient[acrType][stateFilter] = "";
        }
    }

    $scope.onGetRequiredData = function (data, status, headers, config) {
        if (data["states"]) {
            //console.log(data["states"]);
            for (var j = 0; j < $scope.addPatient.contents.countryType.length; j++) {
                $rootScope.patientSearchState.addPatientData.states[$scope.addPatient.contents.countryType[j]] = [];
            }

            for (var i = 0; i < data["states"].length; i++) {
                for (var j = 0; j < $scope.addPatient.contents.countryType.length; j++) {
                    $rootScope.patientSearchState.addPatientData.states[$scope.addPatient.contents.countryType[j]].push(data["states"][i].name);
                    //console.log($scope.addPatient.contents.contact1StateType);
                }
            }
            $scope.addPatient.contents.contact1StateType = $rootScope.patientSearchState.addPatientData.states;
            $scope.addPatient.contents.employerStateType = $rootScope.patientSearchState.addPatientData.states;
            $scope.addPatient.contents.insurance2StateType = $rootScope.patientSearchState.addPatientData.states;
            $scope.addPatient.contents.insurance3StateType = $rootScope.patientSearchState.addPatientData.states;
        } else if (data["countries"]) {
            for (var i = 0; i < data["countries"].length; i++) {
                //console.log(data["countries"]);
                $rootScope.patientSearchState.addPatientData.countries.push(data["countries"][i].name);
                //$scope.addPatient.contents.countryType.push(data["countries"][i].name);
                $scope.addPatient.contents.countryType = $rootScope.patientSearchState.addPatientData.countries;
            }
            if ($.isEmptyObject($rootScope.patientSearchState.addPatientData.states)) {
                $http.get($rootScope.urls.stateListUrl)
                .success($scope.onGetRequiredData)
                .error($scope.onErrorRequiredData);
            }
            //console.log($scope.addPatient.contents.countryType);
        } else if (data["providers"]) {

            for (var i = 0; i < data["providers"].length; i++) {
                //console.log(data["providers"][i]);
                $rootScope.patientSearchState.addPatientData.providers.push(data["providers"][i].fName + " " + data["providers"][i].lName);
            }
            $scope.addPatient.contents.choiceProviderType = $rootScope.patientSearchState.addPatientData.providers;
            $scope.addPatient.contents.choiceRefProviderType = $rootScope.patientSearchState.addPatientData.providers;
        } else if (data["pharmacies"]) {
            for (var i = 0; i < data["pharmacies"].length; i++) {
                $rootScope.patientSearchState.addPatientData.pharmacies.push(data["pharmacies"][i].pharmacyName);
            }
            $scope.addPatient.contents.choicePharmacyType = $rootScope.patientSearchState.addPatientData.pharmacies;
        } else if (data["language"]) {
            for (var i = 0; i < data["language"].length; i++) {
                $rootScope.patientSearchState.addPatientData.language.push(data["language"][i].name);
            }
            $scope.addPatient.contents.languageType = $rootScope.patientSearchState.addPatientData.language;
        } else if (data["referralSources"]) {
            for (var i = 0; i < data["referralSources"].length; i++) {
                $rootScope.patientSearchState.addPatientData.referralSources.push(data["referralSources"][i].name);
            }
            $scope.addPatient.contents.referralSourceType = $rootScope.patientSearchState.addPatientData.referralSources;
        }
        if (!$.isEmptyObject($rootScope.patientSearchState.addPatientData.states) && $rootScope.patientSearchState.addPatientData.countries.length != 0 && $rootScope.patientSearchState.addPatientData.providers.length != 0 && $rootScope.patientSearchState.addPatientData.pharmacies.length != 0 && $rootScope.patientSearchState.addPatientData.language.length != 0 && $rootScope.patientSearchState.addPatientData.referralSources.length != 0)
            $scope.$parent.loaderGifClass.display = "none";
    }

    $scope.onErrorRequiredData = function (data, status, headers, config) {
        $scope.urlRefesh = config.url;
        if (status == 401) {
            //console.log($localStorage.loginUrl);
            $http.get($localStorage.loginUrl).
            success(function (data, status, headers, config) {
                //console.log($scope.urlRefesh);
                $http.get($scope.urlRefesh).
                    success($scope.onFinishedLoadingSelectedVitalsData).
                    error($scope.onErrorLoadingSelectedVitalsData);
            }).
            error(
            function (data, status, headers, config) {
                delete $localStorage.loginUrl;
                if (!$scope.dlg1) {
                    $scope.dlg1 = dialogs.error('Connection expired! You will be logged out.');
                    $scope.dlg1.result.then(function (btn) {
                        //console.log($scope.dlg);
                        $scope.dlg = null;

                        $state.go('login');
                    });
                }

            }
            );
        }
        else {
            //$scope.patientsLoadedInfo = "Error reaching server. Please check your internet connection.";
            $scope.$parent.loaderGifClass.display = "none";
            delete $localStorage.loginUrl;
            if (!$scope.dlg1) {
                $scope.dlg1 = dialogs.error('Unknown error when connecting to the server!', "There seems to be problem with your internet connection!\nCheck you connection and try again!");
                $scope.dlg1.result.then(function (btn) {
                    $scope.dlg = null;
                    //$state.go('login');
                });
            }

        }
    }

    $scope.onPatientAdded = function (data, status, headers, config) {
        //console.log(data.patientID);
        //console.log($scope.status);
        //console.log(status);

        $scope.dialogInstance.dismiss(null);
        $scope.dialogInstance = dialogs.create('templates/dialogs/successDialog.html', 'loadingGifController', { message: "Patient added with ID: " + data.paitentID },
                {
                    'size': 'sm',
                    'windowClass': 'align-modal-dialog'
                });
        //console.log(data);
    }


    $scope.onSaveButtonClicked = function () {
        $scope.dialogInstance = dialogs.create('templates/dialogs/loadingDialog.html', 'loadingGifController', {message: "Uploading"},
                {
                    'size': 'sm',
                    'windowClass': 'align-modal-dialog'
                });
        //$scope.dialogInstance.dismiss(null);
        $scope.dataTobeSent = {
            "who":
            {
                "fname": $scope.addPatient.who.firstName,
                "lname": $scope.addPatient.who.lastName,
                "sex": $scope.addPatient.who.patientSex,
                "dob": $filter('date')($scope.addPatient.addPatientDates.dob, 'yyyy-MM-ddThh:mm:ss+01:00'),
                "dateCreated": $filter('date')(new Date(), 'yyyy-MM-ddThh:mm:ss+01:00'),
                "driverLicence": $scope.addPatient.who.licenseId,
                "socialSecurity": "socialSecurity",
                "maritalStatus": $scope.addPatient.who.maritalFilter,
                "userDefinedName1": $scope.addPatient.who.userDefined1,
                "userDefinedValue1": $scope.addPatient.who.userDefined2,
                "userDefinedName2": $scope.addPatient.who.userDefined3,
                "userDefinedValue2": $scope.addPatient.who.userDefined4
            },
            "contact":
            {
                "street": $scope.addPatient.contact1.address,
                "city": $scope.addPatient.contact1.city,
                "state": $scope.addPatient.contact1.contact1StateFilter,
                "postalCode": $scope.addPatient.contact1.postalCode,
                "country": $scope.addPatient.contact1.contact1CountryFilter,
                "mothersName": $scope.addPatient.contact1.motherName,
                "guardianName": $scope.addPatient.contact1.guardianName,
                "emergencyContactName": $scope.addPatient.contact1.emergencyContact,
                "emergencyContactNumber": $scope.addPatient.contact2.emergencyPhone,
                "phoneHome": $scope.addPatient.contact2.homePhone,
                "phoneBiz": $scope.addPatient.contact2.workPhone,
                "phoneCell": $scope.addPatient.contact2.mobilePhone,
                "email": $scope.addPatient.contact2.contactEmail
            },
            "choice":
            {
                "provider": $scope.addPatient.choices.choiceProviderFilter,
                "referringProvider": $scope.addPatient.choices.choiceRefProviderFilter,
                "pharmacy": $scope.addPatient.choices.choicePharmacyFilter,
                "hippaRecieved": $scope.addPatient.choices.hippaNotice,
                "allowVoice": $scope.addPatient.choices.voiceMessage,
                "leaveMessageWith": $scope.addPatient.choices.leaveMessage,
                "allowMailMessage": $scope.addPatient.choices.mailMessage,
                "allowSMS": $scope.addPatient.choices.sms,
                "allowEmail": $scope.addPatient.choices.email,
                "allowImmunizationReg": $scope.addPatient.choices.registry,
                "allowImmuniztionShare": $scope.addPatient.choices.info,
                "allowHealthInfoExchange": $scope.addPatient.choices.healthInfo,
                "allowPatientPortal": $scope.addPatient.choices.patientPortal
            },
            "employer":
            {
                "occupation": $scope.addPatient.employer.occupation,
                "employerName": $scope.addPatient.employer.employerName,
                "employerAddress": $scope.addPatient.employer.employerAddress,
                "city": $scope.addPatient.employer.employerCity,
                "state": $scope.addPatient.employer.employerStateFilter,
                "postalCode": $scope.addPatient.employer.employerPostalCode,
                "country": $scope.addPatient.employer.employerCountryFilter,
                "date": $filter('date')(new Date(), 'yyyy-MM-ddThh:mm:ss+01:00')
            },
            "stat":
            {
                "language": $scope.addPatient.statistics.languageFilter,
                "ethnicity": $scope.addPatient.statistics.ethnicityFilter,
                "race": $scope.addPatient.statistics.raceFilter,
                "familySize": $scope.addPatient.statistics.familySize,
                "monthlyIncome": $scope.addPatient.statistics.monthlyIncome,
                "homeless": $scope.addPatient.statistics.employerHomeless,
                "interpreter": $scope.addPatient.statistics.interpreter,
                "migrantSeasonal": $scope.addPatient.statistics.employerMigrant,
                "referralSource": $scope.addPatient.statistics.referralSourceFilter,
                "vfc": $scope.addPatient.statistics.vfcFilter
            },
            "deceased":
            {
                "deceasedDate": $filter('date')($scope.addPatient.addPatientDates.misc, 'yyyy-MM-ddThh:mm:ss+01:00'),
                "reasonDeceased": $scope.addPatient.miscellaneous.rDeceseased
            }

        }

        console.log(JSON.stringify($scope.dataTobeSent));
        $http.post($rootScope.urls.patientUploadUrl, $scope.dataTobeSent)
            .success($scope.onPatientAdded)
            .error($scope.onErrorRequiredData);
    }
    if ($rootScope.patientSearchState.addPatientData.countries.length == 0) {
        $scope.$parent.loaderGifClass.display = "block";
        $http.get($rootScope.urls.countrlListUrl)
        .success($scope.onGetRequiredData)
        .error($scope.onErrorRequiredData);
    }
    if ($rootScope.patientSearchState.addPatientData.providers.length == 0) {
        $scope.$parent.loaderGifClass.display = "block";
        $http.get($rootScope.urls.providersListUrl)
        .success($scope.onGetRequiredData)
        .error($scope.onErrorRequiredData);
    }
    if ($rootScope.patientSearchState.addPatientData.pharmacies.length == 0) {
        $scope.$parent.loaderGifClass.display = "block";
        $http.get($rootScope.urls.pharmaciesListUrl)
        .success($scope.onGetRequiredData)
        .error($scope.onErrorRequiredData);
    }
    if ($rootScope.patientSearchState.addPatientData.language.length == 0) {
        $scope.$parent.loaderGifClass.display = "block";
        $http.get($rootScope.urls.languageListUrl)
        .success($scope.onGetRequiredData)
        .error($scope.onErrorRequiredData);
    }
    if ($rootScope.patientSearchState.addPatientData.referralSources.length == 0) {
        $scope.$parent.loaderGifClass.display = "block";
        $http.get($rootScope.urls.referalSourceListUrl)
        .success($scope.onGetRequiredData)
        .error($scope.onErrorRequiredData);
    }
}]);

app.controller('popOverCtrl', ['$scope', function ($scope) {
    if ($scope.items != "null") {
        $scope.value = JSON.parse($scope.items);
        $scope.valueAwailable = true;
    }
    else
        $scope.valueAwailable = false;
}]);

app.controller('transactionsTabSelectionCtrl', ['$scope', '$http', '$rootScope', '$localStorage', function ($scope, $http, $rootScope, $localStorage) {
    $scope.onTransactionsDataLoaded = function (data, status, headers, config) {
        $scope.patientTransactions = [];

        $scope.$parent.loaderGifClass.display = "none";
        for (var i = 0; i < data["transactions"].length; i++) {
            $scope.patientTransactions.push({
                "type": data["transactions"][i].type,
                "date": data["transactions"][i].date,
                "user": data["transactions"][i].user,
                "details": data["transactions"][i].details

            });
        }
        $rootScope.patientDetailsToBeDisplayed.transactions = $scope.patientTransactions;
    }
    $scope.onTransactionsDataError = function (data, status, headers, config) {
        $scope.urlRefesh = config.url;
        if (status == 401) {
            //console.log($localStorage.loginUrl);
            $http.get($localStorage.loginUrl).
            success(function (data, status, headers, config) {
                //console.log($scope.urlRefesh);
                $http.get($scope.urlRefesh).
                    success($scope.onFinishedLoadingSelectedVitalsData).
                    error($scope.onErrorLoadingSelectedVitalsData);
            }).
            error(
            function (data, status, headers, config) {
                delete $localStorage.loginUrl;
                if (!$scope.dlg1) {
                    $scope.dlg1 = dialogs.error('Connection expired! You will be logged out.');
                    $scope.dlg1.result.then(function (btn) {
                        //console.log($scope.dlg);
                        $scope.dlg = null;

                        $state.go('login');
                    });
                }

            }
            );
        }
        else {
            //$scope.patientsLoadedInfo = "Error reaching server. Please check your internet connection.";
            $scope.$parent.loaderGifClass.display = "none";
            delete $localStorage.loginUrl;
            if (!$scope.dlg1) {
                $scope.dlg1 = dialogs.error('Unknown error when connecting to the server!', "There seems to be problem with your internet connection!\nCheck you connection and try again!");
                $scope.dlg1.result.then(function (btn) {
                    $scope.dlg = null;
                    //$state.go('login');
                });
            }

        }
    }

    if (!$rootScope.patientDetailsToBeDisplayed.transactions) {
        $scope.$parent.loaderGifClass.display = "block";
        $scope.url = $rootScope.urls.patientTransactionsUrl + $rootScope.patientDetailsToBeDisplayed.patientID;
        $http.get($scope.url)
            .success($scope.onTransactionsDataLoaded)
            .error($scope.onTransactionsDataError);
    }
    else {
        $scope.patientTransactions = $rootScope.patientDetailsToBeDisplayed.transactions;
    }
}]);

app.controller('disclosureTabSelectionCtrl', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
    $scope.onDisclosuresDataLoaded = function (data, status, headers, config) {
        $scope.patientDisclosure = [];

        $scope.$parent.loaderGifClass.display = "none";
        for (var i = 0; i < data["Disclosures"].length; i++) {
            $scope.patientDisclosure.push({
                "recepientName": data["Disclosures"][i].recipient,
                "disclosureType": data["Disclosures"][i].disclosure,
                "description": data["Disclosures"][i].description

            });
        }
        $rootScope.patientDetailsToBeDisplayed.disclosures = $scope.patientDisclosure;
    }
    $scope.onDisclosureDataError = function (data, status, headers, config) {
        $scope.urlRefesh = config.url;
        if (status == 401) {
            //console.log($localStorage.loginUrl);
            $http.get($localStorage.loginUrl).
            success(function (data, status, headers, config) {
                //console.log($scope.urlRefesh);
                $http.get($scope.urlRefesh).
                    success($scope.onFinishedLoadingSelectedVitalsData).
                    error($scope.onErrorLoadingSelectedVitalsData);
            }).
            error(
            function (data, status, headers, config) {
                delete $localStorage.loginUrl;
                if (!$scope.dlg1) {
                    $scope.dlg1 = dialogs.error('Connection expired! You will be logged out.');
                    $scope.dlg1.result.then(function (btn) {
                        //console.log($scope.dlg);
                        $scope.dlg = null;

                        $state.go('login');
                    });
                }

            }
            );
        }
        else {
            //$scope.patientsLoadedInfo = "Error reaching server. Please check your internet connection.";
            $scope.$parent.loaderGifClass.display = "none";
            delete $localStorage.loginUrl;
            if (!$scope.dlg1) {
                $scope.dlg1 = dialogs.error('Unknown error when connecting to the server!', "There seems to be problem with your internet connection!\nCheck you connection and try again!");
                $scope.dlg1.result.then(function (btn) {
                    $scope.dlg = null;
                    //$state.go('login');
                });
            }

        }
    }

    if (!$rootScope.patientDetailsToBeDisplayed.disclosures) {
        $scope.$parent.loaderGifClass.display = "block";
        $scope.url = $rootScope.urls.patientDisclosureUrl + $rootScope.patientDetailsToBeDisplayed.patientID + "/" + "1"
        $http.get($scope.url)
            .success($scope.onDisclosuresDataLoaded)
            .error($scope.onDisclosuresDataError);
    }
    else {
        $scope.patientDisclosure = $rootScope.patientDetailsToBeDisplayed.disclosures;
    }
}]);

app.controller('encountersTabSelectionCtrl', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
    $scope.encounterFilter = "";
    $scope.onEncounterDataLoaded = function (data, status, headers, config) {
        $scope.$parent.loaderGifClass.display = "none";
        for (var i = 0; i < data.encounters.mEncounters.length; i++) {
            if (!$scope.encounters[$scope.encounterFilter.encounterID][data.encounters.mEncounters[i].type]) {
                $scope.encounters[$scope.encounterFilter.encounterID][data.encounters.mEncounters[i].type] = [];
            }
            $scope.encounters[$scope.encounterFilter.encounterID][data.encounters.mEncounters[i].type].push(data.encounters.mEncounters[i]);

        }
        $rootScope.patientDetailsToBeDisplayed.encounterValues = $scope.encounters;
        console.log($scope.encounters);

    }

    $scope.onEncountersDataLoaded = function (data, status, headers, config) {

        $scope.$parent.loaderGifClass.display = "none";
        $rootScope.patientDetailsToBeDisplayed.encounterData = data["encounters"];

        $scope.encounterHistoryType = $rootScope.patientDetailsToBeDisplayed.encounterData;

    }
    $scope.onEncounterDataError = function (data, status, headers, config) {
        $scope.urlRefesh = config.url;
        if (status == 401) {
            //console.log($localStorage.loginUrl);
            $http.get($localStorage.loginUrl).
            success(function (data, status, headers, config) {
                //console.log($scope.urlRefesh);
                $http.get($scope.urlRefesh).
                    success($scope.onFinishedLoadingSelectedVitalsData).
                    error($scope.onErrorLoadingSelectedVitalsData);
            }).
            error(
            function (data, status, headers, config) {
                delete $localStorage.loginUrl;
                if (!$scope.dlg1) {
                    $scope.dlg1 = dialogs.error('Connection expired! You will be logged out.');
                    $scope.dlg1.result.then(function (btn) {
                        //console.log($scope.dlg);
                        $scope.dlg = null;

                        $state.go('login');
                    });
                }

            }
            );
        }
        else {
            //$scope.patientsLoadedInfo = "Error reaching server. Please check your internet connection.";
            $scope.$parent.loaderGifClass.display = "none";
            delete $localStorage.loginUrl;
            if (!$scope.dlg1) {
                $scope.dlg1 = dialogs.error('Unknown error when connecting to the server!', "There seems to be problem with your internet connection!\nCheck you connection and try again!");
                $scope.dlg1.result.then(function (btn) {
                    $scope.dlg = null;
                    //$state.go('login');
                });
            }

        }
    }


    if (!$rootScope.patientDetailsToBeDisplayed.encounterData) {
        $scope.$parent.loaderGifClass.display = "block";
        $http.get($rootScope.urls.patientEncountersDropDownUrl + $rootScope.patientDetailsToBeDisplayed.patientID)
        .success($scope.onEncountersDataLoaded)
        .error($scope.onEncounterDataError);
    }
    else {
        $scope.encounterHistoryType = $rootScope.patientDetailsToBeDisplayed.encounterData;

    }

    $scope.encounterHistoryChanged = function (value) {
        $scope.encounterFilter = value;
        if (!$scope.encounters[$scope.encounterFilter.encounterID]) {
            $scope.$parent.loaderGifClass.display = "block";
            //console.log($rootScope.urls.patientEncountersUrl + $scope.encounterFilter.id);
            $scope.encounters[$scope.encounterFilter.encounterID] = {};
            $http.get($rootScope.urls.patientEncountersUrl + $scope.encounterFilter.id)
                .success($scope.onEncounterDataLoaded)
                .error($scope.onEncounterDataError);

        }
    }
    $scope.encounters = $rootScope.patientDetailsToBeDisplayed.encounterValues;

}]);
app.controller('remindersPageSelectionCtrl', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
    $scope.onPatientRemindersTabClicked = function (reminder) {
        $scope.patientClinicalRemindersStyleClass = { "border-bottom": "#E4E8EB", "border-bottom-style": "solid" };
        $scope.patientRemindersStyleClass = { "border-bottom": "#E4E8EB", "border-bottom-style": "solid" };
        $scope.patientMessagesRemindersStyleClass = { "border-bottom": "#E4E8EB", "border-bottom-style": "solid" };


        if (reminder == "clinical") {
            $rootScope.patientDetailsToBeDisplayed.piTabState = 0;
            $scope.patientClinicalRemindersStyleClass = { "border-bottom": "#30B69D", "border-bottom-style": "solid" };
            $scope.remindersSelectedHeader.path = "templates/directives/patientDetailsPage/remindersTabContents/clinicalTabContent.html";
        }
        else if (reminder == "patient") {
            $rootScope.patientDetailsToBeDisplayed.piTabState = 1;
            $scope.patientRemindersStyleClass = { "border-bottom": "#30B69D", "border-bottom-style": "solid" };
            $scope.remindersSelectedHeader.path = "templates/directives/patientDetailsPage/remindersTabContents/patientTabContent.html";

        }
        else if (reminder == "messages") {
            $rootScope.patientDetailsToBeDisplayed.piTabState = 2;
            $scope.patientMessagesRemindersStyleClass = { "border-bottom": "#30B69D", "border-bottom-style": "solid" };
            $scope.remindersSelectedHeader.path = "templates/directives/patientDetailsPage/remindersTabContents/messagesTabContent.html";
        }
    }
    $scope.clinicalReminders = {
        examination1: "EXAMINATION",
        status: "DUE",
        examRes: "Opthalmic",
        date: "2015-06-29",
        place: "Medicare Clinic Galway",
        statRes: "Not Due",
        examRes2: "Podiatric",
        date2: "2015-06-30",
        statRes2: "Due",
        examRes3: "Haemoglobin AIC",
        date3: "2015-07-01",
        statRes3: "Completed",
        examination: "MEASUREMENT",
        examRes4: "Urine Microalbumin",
        date4: "2015-07-02",
        statRes4: "Completed"
    }
    $scope.messages = {
        from: "FROM",
        patient: "PATIENT",
        date: "DATE",
        status: "STATUS",
        fromPerson: "Administrator",
        dateM: "2015-06-21",
        patientName: "Sandra Jennings",
        statusM: "New",
        fromPerson1: "Administrator",
        dateM1: "2015-06-27",
        patientName1: "Hugh Lane",
        statusM1: "Completed",
        fromPerson2: "Administrator",
        dateM2: "2015-06-28",
        patientName2: "Kelly Paul",
        statusM2: "Not Completed"

    }
    $scope.patient = {
        from: "FROM",
        patients: "PATIENT",
        date: "DATE",
        fromPerson: "Administrator",
        patientName: "Jack Kirwin",
        dateP: "2015-06-29",
        fromPerson1: "Administrator",
        patientName1: "Maria Murphy",
        dateP1: "2015-06-30",
        fromPerson2: "Administrator",
        patientName2: "Sandra Jennings",
        dateP2: "2015-06-27"

    }


}]);
