var LoginServiceModule = angular.module('services.urlHitService',
    []);

LoginServiceModule.factory('urlHitService', ['$http', '$q', '$rootScope', '$localStorage', 'dialogs', function ($http, $q, $rootScope, $localStorage, dialogs) {


    var service = {};
    var dlg1 = null;
	service.hitUrl = function (url) {
		
	    var deferred = $q.defer();
	    function onErrorLoadingData(p_result)
	    {
	        if (p_result.error == 401) {
	            urlHit($localStorage.loginUrl).then(function (pp_result)
	            {
	                if(!pp_result.data)
	                {
	                    
	                    delete $localStorage.loginUrl;
	                    if (!dlg1) {
	                        dlg1 = dialogs.error('Connection expired! You will be logged out.');
	                        dlg1.result.then(function (btn) {
	                            //console.log($scope.dlg);

	                            dlg = null;
                                deferred.resolve(pp_result);
	                        });
	                    }
	                }
	                else {
	                    hitMyUrl(p_result.config.url);
	                }
	            })
	        }
	        else {
	            
	            delete $localStorage.loginUrl;
	            if (!dlg1) {
	                dlg1 = dialogs.error('Unknown error when connecting to the server!', "There seems to be problem with your internet connection!\nCheck you connection and try again!");
	                dlg1.result.then(function (btn) {
                    deferred.resolve(p_result);
	                    dlg = null;
	                });
	            }
	        }
	    }

	    function hitMyUrl(p_url)
        {
	        urlHit(p_url).then(function (result) {
		        if (!result.data)
		        {
		            onErrorLoadingData(result);
		        }
		        else
                {
		            deferred.resolve(result);
		        }
		    });	
	    }
	    hitMyUrl(url);
		return deferred.promise;
	}
	
	var urlHit = function(url){
        var deferred = $q.defer();
        $http({method: 'GET', url: url}).success(function (data, status, headers, config) {
			
                deferred.resolve({
                    data: data,
                    config: config,
					error: null
					});
        })
		.error(function (data, status, headers, config) {
			deferred.resolve({
			    data: null,
                config: config,
				error: status
			});
		});

        return deferred.promise;
    };
	
    return service;
}]);