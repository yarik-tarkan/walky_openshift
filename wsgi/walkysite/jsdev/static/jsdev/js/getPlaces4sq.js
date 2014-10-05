

var ll = ''; //instead of city
var APIkeys = '&client_id=IIO3YOYCFVJUQKFTZ50KJUY5BNLXYFDKJUEXPO4CVYX5GKB1&client_secret=MDUITSE51VRWGJXD3EEGHYGRZEQOBQCHSFUCIG1WL0SHU0FH';
//var located_city = $('#city_name').text();
var located_city = "Moscow";
loadPlacesByCity(located_city, "");


function loadPlacesByCity(target_city, places_query){
	var url = 'https://api.foursquare.com/v2/venues/explore?';
	var city = target_city; //instead of ll (longitude latitude)
	//var city = located_city;
	var query = places_query;
	var adress = url+'near='+city+'&query='+query+'&limit=25'+'&venuePhotos=1'+APIkeys+'&v=20140910';
	var $venue = $('.venue.hidden');

	$.getJSON(adress,
		function(data) {

			$.each(data.response.groups[0].items, function(i,items){
				//console.log(items);
				var $new_venue = $venue.clone();//.removeClass('hidden');
				$new_venue.attr('data-lng', getVenueLng(items.venue)).attr('data-lat', getVenueLat(items.venue));
				$new_venue.find('.img_wrapper').children('img').attr("src", getVenuePhoto(items.venue));
				$new_venue.find('.venue_title').text(items.venue.name);
				$new_venue.find('.venue_type').children('img').attr("src", getVenueTypeIcon(items.venue)).attr("alt", getVenueTypeText(items.venue)).attr("title", getVenueTypeText(items.venue));
				$new_venue.find('.venue_type').children('img').tooltip({html: true});
				$new_venue.find('.venue_rating').text(" " + getVenueRating(items.venue));
				$new_venue.find('.rating_wrapper').tooltip({html: true});
				$new_venue.find('.venue_link').attr("href", getVenueLink(items.venue));
				$new_venue.find('.venue_link').tooltip({html: true});
				$('#venues_list').append($new_venue);
				$new_venue.ready(function() {
						//$new_venue.removeClass('hidden');
					}
				);
				$new_venue.fadeOut(function() {
				  $(this).removeClass('hidden').fadeIn();
				})
				
		   });
		   
			$( ".draggable" ).draggable({
				appendTo: 'body',
				containment: 'window',
				scroll: false,
				helper: "clone",
				revert: true, 
				zIndex: 10000,
				start: function( event, ui ) {
					//$(this).css('border-width', 0);
				},
				stop: function( event, ui ) {
					//$(this).css('border-width', '1px');
				}
			});
			
			//jQuery('.venue_type').children('img').tooltip("container: 'body'");
			//	$('.rating_wrapper').tooltip({html: true});
			//	$('.venue_link').tooltip();

	});
	
}

function getVenueLat(venue){
	return venue.location.lat;
}
function getVenueLng(venue){
	return venue.location.lng;
}
function getVenuePhoto(venue){
	if( typeof(venue.photos.groups[0].items[0])=="undefined"){
		return $venue.find('.img_wrapper').children('img').attr("src");
	}else{
		return venue.photos.groups[0].items[0].prefix + "60x60" + venue.photos.groups[0].items[0].suffix;
	}
}
function getVenueTypeIcon(venue){
	if( typeof(venue.categories[0].icon)=="undefined"){
		return $venue.find('.venue_type').children('img').attr("src");
	}else{
		return venue.categories[0].icon.prefix + "32" + venue.categories[0].icon.suffix;
	}
}
function getVenueTypeText(venue){
	return venue.categories[0].shortName;
}
function getVenueRating(venue){
	if( typeof(venue.rating)=="undefined"){
		return "N/A"
	}else{
		return venue.rating;
	}
}
function getVenueLink(venue){
	return "https://foursquare.com/v/" + venue.id;
}

$('#search_venues_button').click(function(){
	var search_query = $('#search_venue_input').val();
	$('#venues_list').find('li:not(.hidden)').remove();
	loadPlacesByCity(city_name, search_query);
});