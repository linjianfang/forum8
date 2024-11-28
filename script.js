var root = "./";

window.onload = function(){
  set_common(original, original_started);
}
function original_started(){
  $(".slick, .slick_sp").slick("slickPlay").slick("slickGoTo", 0);
  $(".about_icons").modaal();
}

function original(){
  $(".slick, .slick_sp").slick({
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    dots: true,
    draggable: false,
    pauseOnFocus: false,
    pauseOnHover: false,
    pauseOnDotsHover: false,
    speed: 500,
    swipe: false,
    swipeToslide: false,
    touchMove: false
  }).on("afterChange", function(slick, current){
    $(slick.currentTarget).find(".slick-slide").removeClass("image-show");
    $(slick.currentTarget).find(".slick-current").addClass("image-show");
  }).slick("slickPause");
}
