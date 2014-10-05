$(document).ready(function() {

	//***************
    // Like button handler and animation 
    //***************
	$("#like_button").click(function(){
		
	if(!$(this).hasClass('pressed')){
		$(this).toggleClass("pressed");
		$(this).find('i').toggleClass("glyphicon-heart-empty").toggleClass("glyphicon-heart");
		do_like();
	}else{

	}

	});


});

//*************
//* Send request to "like" the route
//*************
function do_like(){
	$.ajax({
		//data: ({"username":username,"password":password}),
		type: "POST", 
		url: ""+window.location.href+"/like_view/", 
		success: function(data) {
			response = JSON.parse(data);
			//Wrong login/password input
			if (response["response_code"]==-100){
				//$('#login-alert').text(response["message"]).show();
				alert("Error. Can't like this route")
			} else if(response["response_code"]==200){
			//Correct response
			//Show user name instead of login button 
				var current_likes = parseInt($('#like_counter').text());
				$('#like_counter').text(current_likes+1).prop('title', current_likes+1);
			}
		},
		error: function (data) {
			//$('#login-alert').text("Submit fail. Try again").show();
			alert("Connection Error. Can't send request")
		} 
	});
}
