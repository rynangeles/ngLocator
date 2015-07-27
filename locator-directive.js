function ngLocator(Locator, $q){
  var Link = function(scope, element, attrs){
    scope.location = {};
    
    function init(location){
      
      scope.location.coords = location;
      geoCoder().then(setModel);
      var mapContainer = element[0].getElementsByClassName('locator-map')[0],
          autoCompleteInput = element[0].getElementsByClassName('locator-autocomplete')[0];
      
      var map = Locator.googleMap(mapContainer, {
        coords:location,
        zoom: 17
      });
      
      var autocomplete = Locator.googleAutoComplete(autoCompleteInput, {
        types: []
      });
      
      autocomplete.bindTo('bounds', map);
      
      var marker = Locator.googleMarker({
        coords:location,
        map: map
      });
      
      Locator.addListener(marker, 'dragend', function() { 
        scope.location.coords.lat = marker.getPosition().lat();
			  scope.location.coords.lng = marker.getPosition().lng();
			  
			  geoCoder().then(setModel);
      });
      
      Locator.addListener(autocomplete, 'place_changed', function(){
        var place = autocomplete.getPlace();
				
				if (!place.geometry) return; 

    		// If the place has a geometry, then present it on a map.
    		if (place.geometry.viewport) {
      		map.fitBounds(place.geometry.viewport);
    		} else {
          map.setCenter(place.geometry.location);
          map.setZoom(17);
    		}
				marker.setPosition(place.geometry.location);
				marker.setVisible(true);
				
        scope.location.coords.lat = place.geometry.location.lat();
			  scope.location.coords.lng = place.geometry.location.lng();
			  
				geoCoder().then(setModel);
      });
    }
    
    function geoCoder(){
      var deferred = $q.defer();
      var geocoder = Locator.googleGeoCoder();
			var latlng = Locator.googleLatLng(scope.location.coords.lat, scope.location.coords.lng);

			geocoder.geocode({'latLng': latlng}, function(results, status) {
				if (status === Locator.googleGeocoderStatus().OK) {
					if (results[0]) deferred.resolve(results[0]);
				}else{
				  deferred.reject(false);
				}
			});
			return deferred.promise;
    }
    
    function setModel(data){
      var stateLookup = data.address_components.filter(function(component){
				return component.types.indexOf('administrative_area_level_1') >= 0;
			});
			var cityLookup = data.address_components.filter(function(component){
				return component.types.indexOf('administrative_area_level_2') >= 0;
			});
			var postalLookup = data.address_components.filter(function(component){
				return component.types.indexOf('postal_code') >= 0;
			});
			
      scope.location.address = data.formatted_address;
      scope.location.state = stateLookup[0] ? stateLookup[0].long_name : null;
      scope.location.city = cityLookup[0] ? cityLookup[0].long_name : null;
      scope.location.postal = postalLookup[0] ? postalLookup[0].long_name : null;
    }
    
    Locator.getLocation().then(init);
  };
  var Ctrl = function(){};
  
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'locator.html',
    scope: {
      location: '='
    },
    link: Link,
    controller: Ctrl,
    controllerAs: 'locator'
  };
}

ngLocator.$injects = ['Locator', '$q'];

angular.module('locator')
.directive('ngLocator', ngLocator);