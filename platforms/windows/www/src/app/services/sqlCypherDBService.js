var LoginServiceModule = angular.module('services.sqlCytherDb',
    []);

LoginServiceModule.factory('sqlCypherDb', ['$q', '$rootScope', '$localStorage', 'dialogs', '$interval', function ($q, $rootScope, $localStorage, dialogs, $interval) {


    var service = {};
    
    service.checkCypherKeyExists = function(cypherKey)
    {
        var deferred = $q.defer();
        $localStorage.lastDbSync = new Date();
        if($rootScope.db == undefined)
        {
            var myCypherkey = localStorage.getItem("cypherKey");
            if (myCypherkey != undefined && myCypherkey != "")
            {
                console.log("opening db with predefined cypher key");
                service.openDatabase(CryptoJS.AES.decrypt(myCypherkey, "telehealthcare").toString(CryptoJS.enc.Utf8)).then(function (result) {
                    service.checkDbLife().then(function (result) { 
                        deferred.resolve(true);
                    });
                });
            }
            else
            if (cypherKey)
            {
                console.log("setting cypher key and opening db");
                
                
                service.openDatabase(cypherKey).then(function (result) {
                    localStorage.setItem('cypherKey',  CryptoJS.AES.encrypt(cypherKey, "telehealthcare").toString());
                    $localStorage.cypherKey = CryptoJS.AES.encrypt(cypherKey, "telehealthcare").toString();
                    //console.log($localStorage);
                    deferred.resolve(true);
                });
            }
        }
        else
        {
            deferred.resolve(true);
        }
        return deferred.promise;
    }

    service.deleteDataBase = function()
    {
        var deferred = $q.defer();
        window.sqlitePlugin.deleteDatabase({ name: "teleHealthDetails.db", location: 1 }, function (msg) {
            deferred.resolve(true);
        }, function (msg) {
            console.log("error deleting db");
        });
        if(cordova.platformId == "windows")
        {
            console.log("here");
        }
        return deferred.promise;
    }
    service.closeDataBase = function()
    {
        var deferred = $q.defer();
        $rootScope.db.close(function (success) {
            deferred.resolve(true);
        }, function (e) {
            
        });
        return deferred.promise;
    }
    service.deleteAllValuesFromTable = function(tableName)
    {
        var deferred = $q.defer();
        $rootScope.db.transaction(function (tx) {
            var sqlQuery = 'DELETE FROM ' + tableName;
            
            tx.executeSql(sqlQuery, [], function (tx, res) {
                deferred.resolve(true);
            });
        });
        return deferred.promise;
    }
    service.dropAllTables = function()
    {
        var deferred = $q.defer();
        $rootScope.db.transaction(function (tx) {
             var sqlQuries = [
                'DROP TABLE IF EXISTS users',
                'DROP TABLE IF EXISTS appointments',
                'DROP TABLE IF EXISTS patientDetails',
                'DROP TABLE IF EXISTS pdfs'
             ];
             var done = 0;
             for (var i = 0; i < sqlQuries.length ; i++) {
                 tx.executeSql(sqlQuries[i], [], function (tx, res) {
                     //console.log("drop successfull");
                     if (++done == sqlQuries.length)
                     {
                        deferred.resolve(true);  
                     }

                        
                 },
                 function (e) {
                     if (dlg) {
                         dlg.close();
                     }
                     dlg = dialogs.error('An error has occured', 'Local DB error:' + e);
                 });
             }
        });
        /*$rootScope.db.close(function () {
            window.sqlitePlugin.deleteDatabase({ name: "teleHealthDetails.db",  location: 1}, function () {
                console.log("deleted");
                deferred.resolve(true);
            });
        });*/
        
        return deferred.promise;
    }
    service.openDatabase = function(cypherKey)
    {
        var deferred = $q.defer();
        $rootScope.db = window.sqlitePlugin.openDatabase({ name: "teleHealthDetails.db", key: cypherKey, location: 1 });
        //console.log($rootScope.db)
        
        service.createDataTables().then(function (result) {            
            deferred.resolve(true);
        });
        return deferred.promise;
    }

    service.createDataTables = function()
    {
        var deferred = $q.defer();
        $rootScope.db.transaction(function (tx) {
            var sqlQuries = [
                'CREATE TABLE IF NOT EXISTS users (id integer primary key, name text, password text)',
                'CREATE TABLE IF NOT EXISTS appointments (id integer primary key, appointmentData text)',
                'CREATE TABLE IF NOT EXISTS patientDetails (id integer primary key, patientID integer, dob text, gender text, name text, patientDetailsData text)',
                'CREATE TABLE IF NOT EXISTS pdfs (id integer primary key, pdfName text, pdfBase64 text)'
            ];
            var done = 0;
            for (var i = 0; i < sqlQuries.length ; i++)
            {
                tx.executeSql(sqlQuries[i], [], function (tx, res) {
                    //console.log("create successfull");
                    if (++done == sqlQuries.length)
                        deferred.resolve(true);
                },
                function (e) {
                    if (dlg) {
                        dlg.close();
                    }
                    dlg = dialogs.error('An error has occured', 'Local DB error:' + e);
                });
            }
        });
        return deferred.promise;
    }

    service.selectFromTable = function (table, value, condition) {
        var deferred = $q.defer();
        $rootScope.db.transaction(function (tx) {
            errorMessage = "Data DB error";
            //console.log('SELECT ' + value + ' FROM ' + table + (condition ? (" WHERE " + condition) : ""));
            tx.executeSql('SELECT ' + value + ' FROM ' + table + (condition ? (" WHERE " + condition) : ""), [], function (tx, res) {
                deferred.resolve(res.rows);
            },
            function (e) {
                if (dlg) {
                    dlg.close();
                }
                dlg = dialogs.error('An error has occured', 'Local DB error: ' + errorMessage + " " + e);
            });
        });
        return deferred.promise;
    }

    service.updateTable = function (table, valueText, value, condition, conditionValue) {
        var deferred = $q.defer();
        $rootScope.db.transaction(function (tx) {
            errorMessage = "Data DB error";
            var sqlQuery = "UPDATE " + table + " SET " + valueText + "=? WHERE " + condition + "=?";
            tx.executeSql(sqlQuery, [value, conditionValue], function (tx, res) {
                deferred.resolve(true);
            },
             function (e) {
                 if (dlg) {
                     dlg.close();
                 }
                 dlg = dialogs.error('An error has occured', 'Local DB error: ' + errorMessage + " " + e);
             });
        });
        return deferred.promise;
    }
    service.insertIntoTable = function(table, valueText, value)
    {
        var deferred = $q.defer();
        $rootScope.db.transaction(function (tx) {
            errorMessage = "Data DB error";
            var sqlQuery = 'INSERT INTO ' + table;
            var tempvalueText = "(";
            var tempqueryText = "(";
            for (var i = 0; i < valueText.length; i++)
            {
                tempvalueText += valueText[i];
                tempqueryText += "?";
                if(i != valueText.length -1)
                {
                    tempvalueText += ", ";
                    tempqueryText += ", ";
                }
            }
            tempqueryText += ')';
            tempvalueText += ")";
            sqlQuery += " " + tempvalueText + " VALUES " + tempqueryText;
            tx.executeSql(sqlQuery, value, function (tx, res) {
                deferred.resolve(true);
            },
            function (e) {
                if (dlg) {
                    dlg.close();
                }
                dlg = dialogs.error('An error has occured', 'Local DB error: ' + errorMessage + " " + e);
            });
        });
        return deferred.promise;
    }

    service.checkDbLife = function () {
        /*if ($localStorage.lastDbSync == undefined) {
            $localStorage.lastDbSync = new Date();
        }
        else */
        var deferred = $q.defer();
        if ($localStorage.lastDbSync != undefined) {
            var currentDateTime = new Date();
            var lastSync = new Date($localStorage.lastDbSync);
            if (Math.abs((currentDateTime - lastSync) / 86400000) > 1) {
                //service.dropAllTables().then(function (result) {
                service.deleteAllValuesFromTable('users').then(function (result) {
                    delete $localStorage.lastDbSync;
                    deferred.resolve(true);
                });
            }
        }
        return deferred.promise;
    }
    return service;
}]);