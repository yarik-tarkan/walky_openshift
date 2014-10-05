//URL to get Static Map Image
var imageURL = "http://maps.googleapis.com/maps/api/staticmap?size=400x400&path=weight:5|color:blue|enc:";

jQuery(document).ready(function() {
	$("#save_route_button").click(function () {

		var $this = $(this);
		$this.addClass('disabled');
		//$this.popover('hide');
		
		route_points = new Array();
		for (var i=0; i<markers.length; i++){
			//saving_route.route_points[i].point_id = parseInt(markers[i].title.substring(1)); /* Route Point id parsed from Marker Title */
			var li_id = i+1;
			var li_el_id = "#point_"+li_id;
			route_points.push({
				point_id : i,
				point_lat : markers[i].getPosition().lat(),
				point_lng : markers[i].getPosition().lng(),
				/*** HARDCODED POINT NAME ***/
				
				point_name : $(li_el_id).find('.point_title').val(), 
				/*** HARDCODED DESCRIPTION ***/
				point_description : $(li_el_id).find('.point_description').val()
			});
		}

		var saving_route = new Array();
		saving_route.push({
			route_name : $('#route_name').val(),
			/*** HARDCODED USER NAME ***/
			user_name : "walkyuser",
			route_city : "N.N.",
			route_distance : (totalDistance / 1000).toString(), /* Distance in KM */
			route_duration : Math.round(totalDuration / 60), /* Duration in minutes */
			route_type : $('#selected_route_type').data('type'),
			encoded_path : encoded_route,
			route_points : route_points
		}); 
			

		var saving_route_json = JSON.stringify(saving_route); //Optional variable only for console
		console.log(saving_route_json);

		$.ajax ({
			url: "/jsdev/save_route/",
			type: "POST",
			data: {"routes_dic":JSON.stringify(saving_route),},
			success : function(data) {
				alert("Route Saved");
				//Send Route Preview Image
				sendMapPreview(imageURL+encoded_route, "/jsdev/save_route/")
				// REDIRECTION 
				window.location.href = '/jsdev/';
			},
			error : function(data) {
				alert("Error. Route is NOT saved");
				$this.removeClass('disabled');
				//$this.popover('show');
			}

		});

	});
});


function sendMapPreview(imageURL, serverURL){
  var xhr = new XMLHttpRequest();
  xhr.open( "GET", imageURL, true );
  xhr.responseType = "arraybuffer";
  xhr.onload = function( e ) {
    // Obtain a blob: URL for the image data.
    var arrayBufferView = new Uint8Array( this.response );
    var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
    console.log(blob);

    var fd = new FormData();
    fd.append('fname', 'map_preview.jpeg');
    fd.append('data', blob);
    
    $.ajax({
      type: 'UPDATE',
      url: serverURL,
      data: fd,
      processData: false,
      contentType: false
    }).done(function(data) {
           console.log(data);
    });

  };

  xhr.send();    

};