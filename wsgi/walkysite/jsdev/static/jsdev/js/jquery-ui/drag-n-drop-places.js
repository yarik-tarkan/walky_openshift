$('#venues_list').ready(function() {
    $( ".draggable" ).draggable({ revert: "valid" });
    //$( "#draggable2" ).draggable({ revert: "invalid" });
 
    $( ".route_map_wrapper" ).droppable({
      //activeClass: "ui-state-default",
      //hoverClass: "ui-state-hover",
      drop: function( event, ui ) {
        //$( this )
        //  .addClass( "ui-state-highlight" )
        //  .find( "p" )
        //    .html( "Dropped!" );
		alert("Droped!");
      }
    });
  });