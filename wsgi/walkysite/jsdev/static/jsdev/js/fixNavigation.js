/*$(function () {
    var top_offset = $('#content_wrapper').offset().top;
    $('#navigation').css("top", top_offset);
    var navbarHeight = $('#navigation').height();
    var navbarWidth = $('#navigation').width();
    $('#content_wrapper').css('padding-top', navbarHeight)
    $('#navigation').css("height", navbarHeight);
    $('#navigation').css("width", navbarWidth);
    $('#navigation').addClass('fix');

    $(window).scroll(function() {
        var $navigationBar = $('#navigation');
        var st = $(this).scrollTop();
        var current_top = parseInt($navigationBar.css("top"));
        //alert(current_top + " - " + st);
        if( current_top-st >= 0 ) {
            $navigationBar.css("top", current_top-st);
        } 
    }).scroll();

});
*/
function sticky_relocate() {
    //var $navigationBar = $('#navigation');
    //var $navigationBarClone = $navigationBar.clone().addClass('hide');

    var window_top = $(window).scrollTop();
    var div_top = $('#navigation-anchor').offset().top;
    var navbarHeight = $('#navigation').height();
    var navbarWidth = $('#navigation').width();
    if (window_top > div_top) {
        //$navigationBar.addClass('hide');
        $('#navigation').css("height", navbarHeight);
        $('#navigation').css("width", navbarWidth);
        $('#navigation').addClass('fix');
        //$navigationBarClone.removeClass('hide').addClass('fix', 600);
        
    } else {
        //$navigationBar.removeClass('hide');
        //$navigationBarClone.addClass('hide').removeClass('fix');
        $('#navigation').removeClass('fix');

    }
}

$(function () {

    $(window).scroll(sticky_relocate);
    sticky_relocate();
});


jQuery(document).ready(function() {
    var offset = 200;
    var duration = 500;
    jQuery(window).scroll(function() {
        if (jQuery(this).scrollTop() > offset) {
            jQuery('.scroll-to-top').fadeIn(duration);
        } else {
            jQuery('.scroll-to-top').fadeOut(duration);
        }
    });

    jQuery('.scroll-to-top').click(function(event) {
        event.preventDefault();
        jQuery('html, body').animate({scrollTop: 0}, duration);
        return false;
    });
});

//****  ROUTE TYPE ANIMATION
var route_type = "pedestrian"
var category = "top"
var selectType = function (event) {
    
    event.preventDefault(); 
    $selected_types = $('#route_type').find('.selected');
    //If nothing selected
    if($selected_types.length == 0 ){
        $(this).animate({
            'left': 0
        }, 400);
        $(this).addClass("selected");
    }else{
        $selected_types.removeClass('selected').animate({
            'left': -36
        }, 400);
        $(this).animate({
            'left': 0
        }, 400);
        $(this).addClass("selected");
    }  
    var classList = this.className.split(' ')
    
    if (classList.indexOf("type_pedestrian") > -1  ){
        // alert("pedestrian call")
        route_type = "pedestrian"
    }
    else if (classList.indexOf("type_bicycle") > -1  ){
        // alert("bicycle")
        route_type = "bicycle"
    }
    else if (classList.indexOf("type_car") > -1  ){
        // alert("car")
        route_type = "car"
    }
    alert ("get route type: " + route_type)
    $.ajax({
      route_type: "get",
      url: route_type,
      data: {"route_type":route_type,'category_type':category},
      success : function(data){
               $('#thumbnail_wrapper').html(data);
             }
    })

}


//function gets the type of category chosen and sends "GET"
//request to the server
function selectCategory (category) {
    alert("Category chosen! " + category + ' in ' + route_type);
    
    $.ajax({
      type: "get",
      url: category,
      data: {"route_type":route_type,'category_type':category},
      success : function(data){
               $('#thumbnail_wrapper').html(data);
               alert("Render!")
             }
    })
}




$(document).on('click', '.type_btn', selectType);
$(document).on('click', '.cssmenu', selectCategory);
