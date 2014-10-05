$(document).ready(function () {

  // test for presence of geolocation
  if(navigator && navigator.geolocation) {
    // make the request for the user's position
    navigator.geolocation.getCurrentPosition(geo_success, geo_error);
  } else {
    // use freegeoip.net IP to location REST API
    $.getJSON( "http://freegeoip.net/json/", function( data ) {
      if (data.city != ""){
        $("#city_name").fadeOut(function() {
          $(this).text(data.city).fadeIn();
        })       
      }else{
        error("Error, please turn on geolocation services and allow browser to get your position");
      }
    });
    //printAddress(geoip_latitude(), geoip_longitude(), true);
  }
  
});
 
function geo_success(position) {
  printAddress(position.coords.latitude, position.coords.longitude);
}
 
function geo_error(err) {
  showBrowserGeoError(err);
  // instead of displaying an error, fall back to freegeoip.net REST API
  $.getJSON( "http://freegeoip.net/json/", function( data ) {
      //console.log(data);
      if (data.city != ""){
        $("#city_name").fadeOut(function() {
          $(this).text(data.city).fadeIn();
        })       
      }else{
        error("Error, please turn on geolocation services and allow browser to get your position");
      }
    });
  //printAddress(geoip_latitude(), geoip_longitude(), true);
}
//Custom API for Google Reverse Geocoding
function getLocation(){
    var loc = document.getElementById('coords');
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else
    {
        loc.value = "nolocation";
    }
}
//Custom API for Google Reverse Geocoding
function showPosition(position){
    var loc = document.getElementById('coords');
    loc.value = position.coords.latitude + "," + position.coords.longitude;

    var geocoder = new google.maps.Geocoder();
     var latlng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {


                var area = getArea(results)
                document.getElementById('location-box').value = area;
            }
        }
    });
}
// Get ONLY COUNTRY from Google Reverse Geocoding
function getCountry(results)
{
    for (var i = 0; i < results[0].address_components.length; i++)
    {
        var shortname = results[0].address_components[i].short_name;
        var longname = results[0].address_components[i].long_name;
        var type = results[0].address_components[i].types;
        if (type.indexOf("country") != -1)
        {
            if (!isNullOrWhitespace(longname))
            {
                return longname;
            }
            else
            {
                return shortname;
            }
        }
    }
    return "";
}
// Get ONLY CITY from Google Reverse Geocoding
function getArea(results)
{
    var areaName = "";
    for (var i = 0; i < results[0].address_components.length; i++)
    {
        var shortname = results[0].address_components[i].short_name;
        var longname = results[0].address_components[i].long_name;
        var type = results[0].address_components[i].types;

        if (type.indexOf("locality") != -1){
            if (!isNullOrWhitespace(shortname))
            {
                areaName += shortname;
            }
            else
            {
                areaName += longname;
            }
        }
        if (type.indexOf("administrative_area_level_2") != -1 && areaName == ""){
            if (!isNullOrWhitespace(shortname))
            {
                areaName += shortname;
            }
            else
            {
                areaName += longname;
            }
        }
    }
    return areaName;
}
function isNullOrWhitespace(text) {
    if (text == null) {
        return true;
    }
    return text.replace(/\s/gi, '').length < 1;
}
 
// use Google Maps API to reverse geocode our location
function printAddress(latitude, longitude) {
  // set up the Geocoder object
  var geocoder = new google.maps.Geocoder();
 
  // turn coordinates into an object
  var yourLocation = new google.maps.LatLng(latitude, longitude);
 
  // find out info about our location
  geocoder.geocode({ "latLng": yourLocation }, function (results, status) {
    if(status == google.maps.GeocoderStatus.OK) {
      if(results[0]) {
        $("#city_name").fadeOut(function() {
          $(this).text(getArea(results)).fadeIn();
        })
      } else {
        error("Google did not return any results.");
      }
    } else {
      error("Reverse Geocoding failed due to: " + status);
    }
  });
 
}
 
function error(msg) {
  alert(msg);
}

function showBrowserGeoError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred");
            break;
    }
}