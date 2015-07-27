'use strict';

var LocatorService = function ($q) {
    /*jshint camelcase: false */
    /*global google:false */
    /*jshint unused:false*/

  	function googleDistance(origin, destination){
        var deferred = $q.defer();
        var originG = new google.maps.LatLng(origin.lat, origin.lng);
        var destinationG = new google.maps.LatLng(destination.lat, destination.lng);
        var service = new google.maps.DistanceMatrixService();

        service.getDistanceMatrix({
            origins: [originG],
            destinations: [destinationG],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.IMPERIAL,
            avoidHighways: false,
            avoidTolls: false
        }, function (response, status){
            if (status != google.maps.DistanceMatrixStatus.OK) {
                return deferred.reject(status);
            } else {
                return deferred.resolve(response.rows[0].elements[0]);
            }
        });

        return deferred.promise;
    }
    
    function getLocation() {
			var defered = $q.defer();

		    if (navigator.geolocation) {
		        navigator.geolocation.getCurrentPosition(function (position){
		        	defered.resolve({
		        		lat: position.coords.latitude,
		        		lng: position.coords.longitude
		        	});
		        });
		    }else{
		      defered.reject(false);
		    }

		    return defered.promise;
		}
		
		function googleMap(element, options){
		  return new google.maps.Map(element,{
				zoom: options.zoom || 17,
				center: new google.maps.LatLng(options.coords.lat, options.coords.lng)
			});
		}
		
		function googleMarker(options){
	    return new google.maps.Marker({
          position: new google.maps.LatLng(options.coords.lat, options.coords.lng),
          map: options.map,
          title: options.title || '',
          draggable: options.draggable || true
      });
		}
		
		function googleAutoComplete(element, options){
		  return new google.maps.places.Autocomplete(element, {
		    types : options.types || []
		  });
		}
		
		function googleGeoCoder(){
		  return new google.maps.Geocoder();
		}
		
		function googleGeocoderStatus(){
		  return google.maps.GeocoderStatus;
		}
		
		function googleLatLng(lat, lng){
		  return new google.maps.LatLng(lat, lng);
		}
		
		function addListener(instance, eventName, callback){
		  google.maps.event.addListener(instance, eventName, callback);
		}

  	return {
  		googleDistance: googleDistance,
  		getLocation: getLocation, 
  		googleMap: googleMap,
  		googleMarker: googleMarker,
  		googleAutoComplete: googleAutoComplete,
  		googleGeoCoder: googleGeoCoder,
  		googleGeocoderStatus: googleGeocoderStatus,
  		googleLatLng: googleLatLng,
  		addListener: addListener
  	};

};

LocatorService.$inject = ['$q'];

angular.module('locator', [])
.factory('Locator', LocatorService);
