// appends recieved info from Cities db to list
$(document).ready(function(){


  for (var i in Object.keys(json_obj)){

    
    var list = document.getElementById("city_list");
    var li = document.createElement("li");
    var a = document.createElement("a");
    var liValue = document.createTextNode(json_obj[i]["city_name"]);  
    a.appendChild(liValue);
    list.appendChild(li);
    li.appendChild(a);

  }

  $("#city_list li a").click(function(e){
    var chosen_city = $(this).text();
    $("#city_name").text(chosen_city);    
    $("#cityModal").find("button.close").click();
  });



});
// filters list onkeyup
function filter(element) {
        var value = $(element).val();

        $("#city_list > li > a").each(function() {
            if ($(this).text().search(value) > -1) {
                $(this).parent().show();
            }
            else {
                $(this).parent().hide();
            }
        });
}

