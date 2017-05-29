/**
 * Created by sraksh on 12/4/2014.
 */
var AppUtilsServiceModule = angular.module('utils.AppUtils',
    [

    ]);

/**
 * @ngDoc service
 * @name utils.AppUtils
 * @description The service provides common app utilities
 */
AppUtilsServiceModule.factory('AppUtils', function ($rootScope, $filter,$http, $cordovaNetwork, $log, $q ,$document, $timeout, $window) {
   
    var service = {};

    var formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd.MM.yyyy', 'shortDate'];

    service.checkNetwork = function () {
        var deferred = $q.defer();
        $timeout(function(){
            var errorData = {
                errData: 'Your device is not online',
                errStatus: 0
            };
            deferred.resolve(errorData);  // Aborts the $http request if it isn't finished
        }, 10000);

        var httpConfig = {
            timeout: deferred.promise
        };

        $http.get("http://www.google.com", httpConfig)
            .success(function(response) {
                deferred.resolve(response);
            }).error(function (data, status, headers, config) {
                var errorData = {
                    errData: 'Your device is not online',
                    errStatus: 0
                };
                deferred.reject(errorData);
            });
        //return $cordovaNetwork.isOnline(); issue in note 1 will use later in Note3
        return deferred.promise;
    };

    service.xmlToJson = function(xml) {

        var obj = {};

        if (xml !=null && xml.nodeType == 1) { // element
            if (xml.attributes.length > 0) {
                obj["attributes"] = {};
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);
                    obj["attributes"][attribute.nodeName] = attribute.nodeValue;
                }
            }
        } else if (xml.nodeType == 3) { // text
            obj = xml.nodeValue;
        }

        if (xml.hasChildNodes()) {
            for(var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                if (typeof(obj[nodeName]) == "undefined") {
                    obj[nodeName] = service.xmlToJson(item);
                } else {
                    if (typeof(obj[nodeName].push) == "undefined") {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(service.xmlToJson(item));
                }
            }
        }
        return obj;
    };

    service.getContractualMonth = function() {
        var contractualmonth;
        var currentTime = new Date();
        var month = currentTime.getMonth() + 1;
        var year = currentTime.getFullYear();
        if (month == 1) {
            contractualmonth = 'JAN' + year;
        } else if (month == 2) {
            contractualmonth = 'FEB' + year;
        } else if (month == 3) {
            contractualmonth = 'MAR' + year;
        } else if (month == 4) {
            contractualmonth = 'APR' + year;
        } else if (month == 5) {
            contractualmonth = 'MAY' + year;
        } else if (month == 6) {
            contractualmonth = 'JUN' + year;
        } else if (month == 7) {
            contractualmonth = 'JUL' + year;
        } else if (month == 8) {
            contractualmonth = 'AUG' + year;
        } else if (month == 9) {
            contractualmonth = 'SEP' + year;
        } else if (month == 10) {
            contractualmonth = 'OCT' + year;
        } else if (month == 11) {
            contractualmonth = 'NOV' + year;
        } else if (month == 12) {
            contractualmonth = 'DEC' + year;
        }
        return contractualmonth;
    };

    /***
     * @description this method will convert object to xml with namespacePrefix
     * @param _obj
     * @param namespacePrefix
     * @returns {string}
     */
    service.convertToXmlATT = function(_obj, namespacePrefix) {
        var xml = '';
        xml += '<' + namespacePrefix ;
        for (var key in _obj) {
            xml += ' ' + key + '=' + '"' + _obj[key] + '"';
        }
        xml += ' ' + '/>';
        return xml;
    };

    /***
     *
     * @param _xml
     * @returns {*}
     */
    service.xmlDomFromString = function(_xml) {
        var xmlDoc = null;

        if (window.DOMParser) {
            var parser = new DOMParser();
            xmlDoc = parser.parseFromString(_xml,"text/xml");
        }
        else {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
            xmlDoc.loadXML(_xml);
        }
        return xmlDoc;
    };

    service.getDate = function() {
        var currentTime = new Date();
        return $filter('date')(currentTime, formats[1]);
    };

    service.getXDate = function(){
        return new XDate();
    };

    service.checkSessionEnd = function(sessionStart){
        var now = service.getXDate();
        if(service.isRealObject(sessionStart)) {
            var time = new XDate(sessionStart).diffMinutes(now);
            $log.debug('Diff Time', time, now, sessionStart);
            if(time > 15 ){
                return true;
            }
        }
        return false;
    };

    service.isRealObject = function(obj){
        return obj && obj !== "null" && obj!== "undefined";
    };

    service.convertMS = function(ms) {
        var d, h, m, s;

        s = (ms/1000);
        return { d: d, h: h, m: m, s: s };
    };

    service.dateFormat = function(dte){
        var date = dte.toString();
        var date_arr = date.split("-");
        var new_date = date_arr[1]+date_arr[2];
        return (new_date);
    };

    service.getElevenDaysOldDate = function(){
        var currentDate = service.getXDate();
    };

    service.getTwoMonthOldDate = function(){
        var currentDate = service.getXDate();
    };

    service.deviceReady = function(){
        var defer = $q.defer();

        this.ready = defer.promise;

        var timoutPromise = $timeout(function() {
            if ($window.cordova){
                defer.resolve($window.cordova);
            } else {
                defer.reject("Cordova failed to load");
            }
        }, 1200);

        angular.element($document)[0].addEventListener('deviceready', function() {
            $timeout.cancel(timoutPromise);
            defer.resolve($window.cordova);
        });

        return defer.promise;
    };

    return service;
});