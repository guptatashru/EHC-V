var LoginServiceModule = angular.module('services.sqlCytherDb',
    []);

LoginServiceModule.factory('sqlCypherDb', ['$q', '$rootScope', '$localStorage', 'dialogs', '$interval', function ($q, $rootScope, $localStorage, dialogs, $interval) {


    var service = {};
    
    service.checkCypherKeyExists = function(cypherKey)
    {
        var deferred = $q.defer();
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
                $localStorage.lastDbSync = new Date();
                
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
                console.log("Values from table " + tableName + " deleted.");
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
                'DROP TABLE IF EXISTS patientDetails'
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
                'CREATE TABLE IF NOT EXISTS patientDetails (id integer primary key, patientID integer, dob text, gender text, name text, patientDetailsData text)'
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
            console.log('SELECT ' + value + ' FROM ' + table + (condition ? (" WHERE " + condition) : ""));
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
    //service.checkCypherKeyExists();
    /*var dlg = null;
    var errorMessage = undefined;

    service.openDataBase = function(dbName, cypherKey)
    {
        var deferred = $q.defer();
        $rootScope.dataDb = window.sqlitePlugin.openDatabase({ name: dbName, key: cypherKey });
        deferred.resolve($rootScope.dataDb);
        return deferred.promise;
    }

    service.closeDataBase = function (dbName, cypherKey) {
        var deferred = $q.defer();
        $rootScope.dataDb.close();
        $rootScope.dataDb = null;
        deferred.resolve($rootScope.dataDb);
        return deferred.promise;
    }

    service.createTableInDataDb = function(table, values)
    {


    }



    service.selectFromTableInUserDb = function (table, value, condition) {
        var deferred = $q.defer();
        $rootScope.userDb.transaction(function (tx) {
            errorMessage = "Data DB error";
            tx.executeSql('SELECT ' + value + ' FROM ' + table + (condition ? (" WHERE " + condition) : ""), [], function (tx, res) {
                console.log("done");
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

    service.insertToUserDb = function (table, name, password, cypherKey) {
        $rootScope.userDb.transaction(function (tx) {
            errorMessage = "User db entering data";
            tx.executeSql('INSERT INTO ' + table + ' (name, password, cypherKey) VALUES (?, ?)', [name, password, cypherKey], function (tx, res) {
                console.log("inserted");
            },
            function (e) {
                if (dlg) {
                    dlg.close();
                }
                dlg = dialogs.error('An error has occured', 'Local DB error: ' + errorMessage + " " + e);
            });
        });
    }


    service.openUserDataBase = function (cypherKey)
    {
        $rootScope.userDb = window.sqlitePlugin.openDatabase({ name: "users.db", key: cypherKey });
        service.createTableUserDb();
    }

    service.closeUserDb = function ()
    {
        $rootScope.userDb.close();
    }

    service.createTableUserDb = function()
    {
        $rootScope.userDb.transaction(function (tx) {
            errorMessage = "User db creation error";
            tx.executeSql('CREATE TABLE IF NOT EXISTS users (id integer primary key, name text, password text, cypherKey text)', [], function (tx, res) {
                service.checkDbLife();
            },
            function (e) {
                if (dlg)
                {
                    dlg.close();
                }
                dlg = dialogs.error('An error has occured', 'Local DB error: ' + errorMessage + " " + e);
            });
        });
    }



    service.executeSql = function (sql) {
        var db_password = null;
        setCypherKey().then(function (result) {
            db_password = result.pwd;
            var db = window.sqlitePlugin.openDatabase({ name: "patientData.db", key: db_password });
        });
        //
        db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS test_table (id integer primary key, data_num integer)');

            tx.executeSql("INSERT INTO test_table (data_num) VALUES (?)", [100], function (tx, res) {
                tx.executeSql("INSERT INTO test_table (data_num) VALUES (?)", [200], function (tx, res) {
                    tx.executeSql("select count(id) as cnt from test_table;", [], function (tx, res) {
                        console.log("res.rows.length: " + res.rows.length);
                        console.log("res.rows.item(0).cnt: " + res.rows.item(0).cnt);
                    });

                });


            });
        });
    }

    function setCypherKey()
    {
        var deferred = $q.defer();
        if (!$localStorage.cypherKey) {
            $localStorage.cypherKey = $localStorage.passWord;
        }
        deferred.resolve({
            pwd: $localStorage.cypherKey
        });
        return deferred.promise;
    }
    
    service.openUserDataBase("user");*/
    return service;
}]);