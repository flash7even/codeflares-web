/*!
 * Sidebar menu for Bootstrap 4
 * Copyright Zdeněk Papučík
 * MIT License
 */
(function($) {
  var flg = 0;

  // toggle sidebar menu
  $('#sidebar-toggle').on('click', function() {
    //alert(flg)
    if(flg == 1){
      $(".sidebar-lighten").css({
        "margin-top": "-8px",
        "background-color": "#1d324b",
        "border-top": "1px solid #1d324b",
        "box-shadow": "0px 0px 5px #1d324b",
        "border-radius": "0px",
        "margin-left": "0",
        "position": "fixed",
        "z-index": "1"
      });
      flg = 0;
      $(".cfs-body").css("margin-left", "280px")
    }else{
      $(".sidebar-lighten").css({
        "margin-top": "-8px",
        "background-color": "#1d324b",
        "border-top": "1px solid #1d324b",
        "box-shadow": "0px 0px 5px #1d324b",
        "border-radius": "0px",
        "margin-left": "-17rem"
      });
      $(".cfs-body").css("margin-left", "40px")
      flg = 1;
    }
    //$('#wrapper').toggleClass('sidebar-toggle');
    //alert($(".sidebar-lighten").css("margin-left"));
  });

  // list init
  $('.list-item').each(function() {
    $(this).parent().find('.link-arrow').addClass('up');
    if ($(this).find('.link-current').length > 0) {
        $(this).parent().find('.link-current.link-arrow').addClass('active down');
        $(this).parent().find('.link-current').next('.list-hidden').show();
    }
  });

  // list open hidden
  $('.list-link').on('click', function() {
    $(this).parent().find('.link-arrow').toggleClass('active');
    $(this).next('.list-hidden').slideToggle('fast');
  });

  // list transition arrow
  $('.link-arrow').on('click', function() {
    $(this).addClass('transition');
    $(this).toggleClass('rotate');
    if ($(this).parent().find('.link-arrow').hasClass('down')) {
        $(this).toggleClass('rotate-revert');
    }
  });

}(jQuery));
