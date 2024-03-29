	var map;
	var directionsDisplay;
	var directionsService = new google.maps.DirectionsService();
	var bounds = new google.maps.LatLngBounds();
	
	function initialize() {
	    var NY = new google.maps.LatLng(40.739112,-73.785848);
	    var mapOptions = {
	    	minZoom: 2,
	        zoom: 10,
	        center: NY,
	        mapTypeId: google.maps.MapTypeId.ROADMAP
	    }
	    map = new google.maps.Map(document.getElementById('route_map'),mapOptions);

		directionsDisplay = new google.maps.DirectionsRenderer();
		directionsDisplay.setMap(map);
		
		
		waypt = [];
		var start, end;

		//var route_json = JSON.parse(json_obj);
		//alert("Got " + Object.keys(json_obj['route_points']).length + " points");
		if (Object.keys(json_obj['route_points']).length==0) return;

		var route_points = json_obj['route_points'];
		
		//alert("Got " + json_obj[pointsId[0]]["lat"] + " points");
		for (var p in route_points){
			//Check if point is first			
			if (route_points[p]['point_id']==0){
				start = new google.maps.LatLng(route_points[p]['point_lat'], route_points[p]['point_lng'], true);
				bounds.extend(start);
		
				//Add Marker on the map
				var marker = new google.maps.Marker({
					position: start,
					map: map
				});
				//console.log(start);
			}
			//Check if point is last
			else if (route_points[p]['point_id']==route_points.length-1){
				end = new google.maps.LatLng(route_points[p]['point_lat'], route_points[p]['point_lng'], true);
				bounds.extend(end);

				//Add Marker on the map
				var marker = new google.maps.Marker({
					position: end,
					map: map
				});
				//console.log(end);
			}
			else{
				var point = new google.maps.LatLng(route_points[p]['point_lat'], route_points[p]['point_lng'], true);
				waypt.push({
					location: point,
					stopover: true
				});
				bounds.extend(point);

				//Add Marker on the map
				var marker = new google.maps.Marker({
					position: point,
					map: map
				});
			}
		}
		
		var route_type;
		if (json_obj['route_type']=="pedestrian"){
			route_type = google.maps.TravelMode.WALKING;
		} else if (json_obj['route_type']=="bicycle") {
			route_type = google.maps.TravelMode.BICYCLING;
		} else if (json_obj['route_type']=="car"){
			route_type = google.maps.TravelMode.DRIVING;
		}
		//this is how to manipulate with google maps
		//we should construct such a request
		var request = {
		    origin: start,
		    destination: end,
			waypoints: waypt,
		    travelMode: route_type
	  	};
	  

	  //* DIRECTION SERVICES (REPLACED WITH POLYLINES)
	  /*
	  directionsService.route(request, function(result, status) {
	  	

	    if (status == google.maps.DirectionsStatus.OK) {
	      //directionsDisplay.setDirections(result);

      	  	//**** Route with POLYINES
		  	var polyline = new google.maps.Polyline({
			  path: [],
			  strokeColor: '#0080ff',
			  strokeOpacity: 0.8,
			  strokeWeight: 5
			});
			var bounds = new google.maps.LatLngBounds();


			var legs = result.routes[0].legs;
			for (i=0;i<legs.length;i++) {
			  var steps = legs[i].steps;
			  for (j=0;j<steps.length;j++) {
			    var nextSegment = steps[j].path;
			    for (k=0;k<nextSegment.length;k++) {
			      polyline.getPath().push(nextSegment[k]);
			      bounds.extend(nextSegment[k]);
			    }
			  }
			}

			//***********Add polylines on the map

			polyline.setMap(map);
			map.fitBounds(bounds);

			var encode_string = google.maps.geometry.encoding.encodePath( polyline.getPath() );
			console.log(encode_string);

			var decodedPath = google.maps.geometry.encoding.decodePath(encode_string);

			var setPath = new google.maps.Polyline({
		        path: decodedPath,
		        strokeColor: "#0080ff",
		        strokeOpacity: 0.8,
		        strokeWeight: 5,
		        map: map
		    });
		    map.fitBounds(bounds);
			//decodedPath.setMap(map);


	    }
	    if (status == google.maps.DirectionsStatus.ZERO_RESULT) {
	      alert("Error. Not able to build route (ZERO_RESULT)")
	    }
	  });*/

		// Route via polylines
		var encoded_route = json_obj['encoded_path'];
		var decoded_route = google.maps.geometry.encoding.decodePath(encoded_route);
		var setPath = new google.maps.Polyline({
		        path: decoded_route,
		        strokeColor: "#0080ff",
		        strokeOpacity: 0.8,
		        strokeWeight: 5,
		        map: map
		    });

	    map.fitBounds(bounds);

 
 }
google.maps.event.addDomListener(window, 'load', initialize);