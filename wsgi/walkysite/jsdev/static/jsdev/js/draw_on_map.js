var map;
var markers = [];
var city = new google.maps.LatLng(56.497884, 43.732238);
var city_name="";
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

var path = new google.maps.MVCArray();
var line;

var polyline_route;
var encoded_route;

var totalDistance = 0; //in metres
var totalDuration = 0; //in seconds

function initialize() {
	$('#continue_button').addClass('disabled');
    //var city = new google.maps.LatLng(56.297884, 43.932238);
    var mapOptions = {
        zoom: 12,
        center: city,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById('route_map'),mapOptions);

	directionsDisplay = new google.maps.DirectionsRenderer();
	directionsDisplay.setMap(map);
	directionsDisplay.setOptions( { suppressMarkers: true } ); //removes default A,B markers
	
	var lineSymbol = {
		path: google.maps.SymbolPath.CIRCLE,
		fillColor: '#919191',
		fillOpacity: 1.0,
		strokeColor: '#919191', 
		strokeOpacity: 1.0,
		scale: 2
	};

	line = new google.maps.Polyline({
				//path: lineCoordinates,
				strokeOpacity: 0,
				icons: [{
				  icon: lineSymbol,
				  offset: '0',
				  repeat: '10px'
				}],
				map: map
			});
	line.setMap(map);
	line.setPath(path);

    google.maps.event.addListener(map, 'click', function(event) {
                addMarker(event.latLng);
    });

	    
}

function addMarker(location) {
	$('#save_route_button').addClass('disabled'); //disable Continue button while drawing route
	$('#next_step_button').hide(); //disable sliding right to timeline unless route is built
	console.log( path.getAt(path.length-1) );
	console.log(location);

	 
	if( path.length>0 && path.getAt(path.length-1).equals(location) ){
		alert("This point is the same as previous. Please select another one");
		return;
	}

	line.setMap(map);//show dashed line
	directionsDisplay.setMap(null); //hide previous built route
	if (polyline_route){
		polyline_route.setMap(null); //hide previous built route
	}

	path.insertAt(path.length, location);
/* 	alert("works");
 */	
    var marker = new google.maps.Marker({
		animation: google.maps.Animation.DROP,
		draggable: true,
        position: location,
        map: map
		
    });
    /*
	google.maps.event.addListener(marker, 'rightclick', function(event) {
                marker.setMap(null);
				
				for (var i=0; i<markers.length; i++){
					if (markers[i].getPosition() == marker.getPosition())
					{
						markers.splice(i,1);
						showRoute(markers);
					}
				}
				//if (markers.length != 0)
					//<!-- alert(markers.toString()); -->
    });*/
	var tempPosition;
	// google.maps.event.addListener(marker,'drag',function(event) {        document.getElementById('lat').value = event.latLng.lat();        document.getElementById('lng').value = event.latLng.lng();		tempPosition = event.latLng;		 alert(tempPosition.toString());    }); -->
    // google.maps.event.addListener(marker,'dragend',function(event) {        document.getElementById('lat').value = event.latLng.lat();        document.getElementById('lng').value = event.latLng.lng();		for (var i=0; i<markers.length; i++){			if (markers[i].getPosition() == tempPosition)			{				markers[i].setPosition(event.latLng);				alert(markers[i].getPosition().toString()); 			}		}    }); -->
	
    markers.push(marker);
	//<!-- alert(markers); -->

	//marker.setTitle("#" + path.length);

    google.maps.event.addListener(marker, 'rightclick', function() {
    	$('#save_route_button').addClass('disabled'); 
    	$('#next_step_button').hide(); //disable sliding right to timeline unless route is built
		marker.setMap(null);
		for (var i = 0, I = markers.length; i < I && markers[i] != marker; ++i);
		markers.splice(i, 1);
      	path.removeAt(i);
    	line.setMap(map);//show dashed line
		directionsDisplay.setMap(null); //hide previous built route
		if (polyline_route){
			polyline_route.setMap(null); //hide previous built route
		}

		if (markers.length<2){
			$('#build_route_button').addClass('disabled');
		}else{
			$('#build_route_button').removeClass('disabled');
		}

    });

    google.maps.event.addListener(marker, 'dragend', function() {
    	$('#save_route_button').addClass('disabled');
    	$('#next_step_button').hide(); //disable sliding right to timeline unless route is built
		for (var i = 0, I = markers.length; i < I && markers[i] != marker; ++i);
		path.setAt(i, marker.getPosition());
		line.setMap(map);//show dashed line
		directionsDisplay.setMap(null); //hide previous built route
		if (polyline_route){
			polyline_route.setMap(null); //hide previous built route
		}

		if (markers.length<2){
			$('#build_route_button').addClass('disabled');
		}else{
			$('#build_route_button').removeClass('disabled');
		}

    });
	//showRoute(markers);

	if (markers.length<2){
		$('#build_route_button').addClass('disabled');
	}else{

		$('#build_route_button').removeClass('disabled');
	}

}


function showRoute(markersArray, route_type){

	totalDistance = 0;
    totalDuration = 0;

	if (markersArray.length>1) {
		//<!-- var start = markersArray[0].getPosition(); -->
		//<!-- var end = markersArray[markersArray.length-1].getPosition(); -->
		var waypts = [];	
		//var start = markersArray[0].getPosition();
		//var end = markersArray[markersArray.length-1].getPosition();
		var start = markersArray[0];//.getPosition();
		var end = markersArray[markersArray.length-1];//.getPosition();

		for (var i=1; i<markersArray.length-1; i++){
		waypts.push({
	            location:  markersArray[i],//.getPosition(),
	            stopover:true
	        });
		}
		var request;
		if (route_type=="pedestrian"){
			request = {
			    origin:start,
			    destination:end,
				waypoints: waypts,
			    travelMode: google.maps.TravelMode.WALKING,
			    unitSystem: google.maps.UnitSystem.METRIC 
			};
		} else if(route_type=="bicycle"){
			request = {
			    origin:start,
			    destination:end,
				waypoints: waypts,
			    travelMode: google.maps.TravelMode.BICYCLING,
			    unitSystem: google.maps.UnitSystem.METRIC 
			};
		} else if(route_type=="car"){
			request = {
			    origin:start,
			    destination:end,
				waypoints: waypts,
			    travelMode: google.maps.TravelMode.DRIVING,
			    unitSystem: google.maps.UnitSystem.METRIC 
			};
		} else {
			alert("Error with route type");
			return;
		}
		
	  
		directionsService.route(request, function(result, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				//directionsDisplay.setMap(map);
				//directionsDisplay.setDirections(result);

				//**** Route with POLYINES
			  	polyline_route = new google.maps.Polyline({
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
				      polyline_route.getPath().push(nextSegment[k]);
				      bounds.extend(nextSegment[k]);
				    }
				  }
				}
				polyline_route.setMap(map);
				map.fitBounds(bounds);
				encoded_route = google.maps.geometry.encoding.encodePath( polyline_route.getPath() );

				console.log(result);
				line.setMap(null);
				var legs = result.routes[0].legs;
				for (var i=0; i<legs.length; i++){
					totalDistance += legs[i].distance.value;
        			totalDuration += legs[i].duration.value;					
				}
				//alert("Distance: " + totalDistance + ", Duration: " + totalDuration);
				var totalDistanceString = (totalDistance / 1000).toString()
				var dotIndex = totalDistanceString.indexOf("."); 
				$('#distance_value').text(totalDistanceString.substring(0,dotIndex+3).trim() + " km");
				$('#duration_value').text( Math.round(totalDuration / 60) + " min");
				$('#continue_button').removeClass('disabled');
			  
			}else{
			 alert('SATUS:'+ status);
			 $('#build_route_button').removeClass('disabled');
			}
		});
  
	}

}

// Dropppable Event handler
$('#venues_list').ready(function() {
 
    $( "#route_map" ).droppable({
      //activeClass: "ui-state-default",
      //hoverClass: "ui-state-hover",
      drop: function( event, ui ) {
		//alert("Droped!");
		var lat = ui.draggable.attr('data-lat');
		var lng = ui.draggable.attr('data-lng');

		var venue_location = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
		//console.log(venue_location);
        addMarker(venue_location);
        map.setCenter(venue_location);
        //ui.draggable.disable();
      }
    });
  });

function buildRoute(markersArray){
	
	//Intialize the Path Array
    //var path = new google.maps.MVCArray();
 
    //Intialize the Direction Service
    var service = new google.maps.DirectionsService();
 
    //Set the Path Stroke Color
    var poly = new google.maps.Polyline({ map: map, strokeColor: '#4986E7' });

	for (var i = 0; i < markers.length; i++) {
            if ((i + 1) < markers.length) { //<!-- markers.length > 2 -->
                var src = markers[i].getPosition();
                var des = markers[i + 1].getPosition();
                path.push(src);
                poly.setPath(path);
                service.route({
                    origin: src,
                    destination: des,
                    travelMode: google.maps.DirectionsTravelMode.DRIVING
                }, function (result, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
                            path.push(result.routes[0].overview_path[i]);
                        }
                    }
                });
            }
        }
	
}

google.maps.event.addDomListener(window, 'load', initialize);

function ololo(){
	xmlhttp.open("POST", "ajax_test.asp", true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send("i2=demid&name=priora");
}

function sendPoints(){
	
	if (markers.length > 1) 
	{
		alert('clicked!');
		var startpoint = {start: markers[0].getPosition()};
		//jsonString = JSON.stringify(startpoint);
		//jsonString = formatData(markers);
		var points = {};
		for(var i = 0; i < markers.length; i++) {
			var obj = {};
			obj['lat'] = markers[i].getPosition().lat();
			obj['lon'] = markers[i].getPosition().lng();
			//newData.push(obj);
			points["point_"+i.toString()] = obj;
		}
		jsonString = JSON.stringify(points);
			
		$.ajax ({
			url: "/updt/",
			type: "POST",
			data: jsonString,
			success : function(data) {
				alert(data);
				},
			
		});
		
		/* $.getJSON('/url/to/ajax/view/', {foo: 'bar'}, function(data, jqXHR){
			// do something with response
		}); */
	}
}

function clearMap() { //deletes all points on the map
	//alert('You are going to clear the map');
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
	markers = [];
	directionsDisplay.setMap(null);
	directionsDisplay = new google.maps.DirectionsRenderer();
	var directionsService = new google.maps.DirectionsService();
	directionsDisplay.setMap(map);
}

function clearDB() {
	alert('You are deleting all data in DB');
	var message = {};
	message["action"] = "clearDB";
	jsonString = JSON.stringify(message);
	alert(jsonString);
	
	$.ajax ({
			url: "/cleardb/",
			type: "POST",
			data: jsonString,
			success : function(data) {
				alert(data);
				},
			
		});

}

function formatData(data) { //Converts LatLng array to JSON
    //data is an array of many LatLng objects

    newData = [];
	var points;

    for(var i = 0; i < data.length; i++) {
        var obj = new Object();
        obj['lat'] = data[i].lat();
        obj['lon'] = data[i].lng();
        newData.push(obj);
		points[i.toString()] = obj;
    }

    return JSON.stringify(points);     
}