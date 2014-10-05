$(document).ready(function() {


	//***************
    // User logout popover 
    //***************
	$(".username").popover({
	    html: true,
	    trigger: 'click', 
		content: function() {
	          return $('#popover_content_wrapper').html();
	        },
	    placement: 'bottom'
	}); 

	$('#popover_content_wrapper').find('a').attr('href', ""+window.location.href+"/logout/");
	//***************
	//* Log In button handler
	//* Send POST request
	//* Change content on page depending on response
	//***************
	$('#login_form').submit(function() {
		var username = document.getElementById('username').value;
		var password = document.getElementById('password').value;


		$.ajax({
			data: ({"username":username,"password":password}),
			type: $(this).attr('method'), 
			url: $(this).attr('action'), 
			success: function(data) {
				response = JSON.parse(data);
				//Wrong login/password input
				if (response["response_code"]==-100){
					$('#login-alert').text(response["message"]).show();
				} else if(response["response_code"]==200){
				//Correct login/password
				//Show user name instead of login button 
					$('#login-alert').hide();
					$('#login_button').replaceWith(response["template"]);
					$("#loginModal").find('button.close').click();
					$("#cssmenu ul #add").find("a").attr('href', "add");

					//***************
				    // User logout popover 
				    //***************
					$(".username").popover({
					    html: true,
					    trigger: 'click', 
						content: function() {
					          return $('#popover_content_wrapper').html();
					        },
					    placement: 'bottom'
					});
				}
			},
			error: function (data) {
				$('#login-alert').text("Submit fail. Try again").show();
			} 
		}); 
		return false;
	});
});

//************
//* Prevent redirect to add_route page, ask to login first
//************
function force_login(){
	$('#login-alert').text("Ops! To add a route you first need to login").show();
	$("#login_button").click();

	$("#loginModal").find('button.close').click(function(){
		$('#login-alert').hide();
	});
}