$(function(){

  $('.js-nav-btns').on('click', 'a', onClickNavBtns);

  $('.js-btn-order').on('click', onClickNavBtns);
  function onClickNavBtns(e){
    e.preventDefault();
      var target = $(e.target);
      target.parent().find('.nav-btns--active').removeClass('nav-btns--active');
      target.addClass('nav-btns--active');

      if(target.hasClass('nav-btns__eng')){
        window.location = target.attr('href');
      }

      var modal = target.data('target');

      $(modal)
      .removeClass('hidden')
      .find('.animated')
      .addClass('fadeInDown');


      if(modal == '#modal-service-order') $('.page-header').addClass('hidden');
      $("html,body").css("overflow","hidden");
      disableScroll();

      if(window.innerWidth < 768){
        $('.js-navbar-collapse').collapse('hide');
      }
  }




  $('.modal__close').on('click', closeModalPhone);

  function closeModalPhone(e){
      var modal = $(this).closest('.modal');

      modal.find('.animated')
      .addClass('fadeOutDown');

      $("html,body").css("overflow","auto");
      enableScroll();

      setTimeout(function(){
        $('.page-header').removeClass('hidden');
        modal.addClass('hidden');
        modal.find('.fadeOutDown').removeClass('fadeOutDown').removeClass('fadeInDown');
        $('.nav-btns .nav-btns--active').removeClass('nav-btns--active');
      },1000);

  }

  if($('#main-onepage').length){
    $('#main-onepage').onepage_scroll();


  }
  $('.js-onepage-links a').on('click', onLinksClick);
  function onLinksClick(){
        $(this).moveTo($(this).data('index'));
      };

  var heroHeight = $('#main-hero').outerHeight();

  if ($("#main-hero").length && $(window).width() > 992){
      $("#main-hero").vide("video/video_2", {});
      var instance = $("#main-hero").data("vide");

     $(window).scroll(function(e){

       if(!instance && $(window).scrollTop() < heroHeight) {
        setTimeout(function(){$("#main-hero").vide("video/video_2", {})}, 1000);
       }
       if(instance && $(window).scrollTop()< heroHeight) return;
       if(instance && $(window).scrollTop()> heroHeight) instance.destroy();

     });

     if($('#map_canvas').length){

      var address = new google.maps.LatLng(60.007100,30.368356);
      var center = new google.maps.LatLng(60.007424,30.364282);
      var MY_MAPTYPE_ID = 'mystyle';
      initializeMap();

      function initializeMap() {

            //     var stylez =   [
            //   {
            //     "stylers": [
            //       { "gamma": 0.25 },
            //       { "hue": "#1100ff" },
            //       { "visibility": "on" },
            //       { "invert_lightness": true },
            //       { "saturation": 33 },
            //       { "lightness": -81 }
            //     ]
            //   }
            // ];

            /*
            Стили для geo:
            [{"featureType":"water","elementType":"geometry.fill","stylers":[{"invert_lightness":true},{"color":"#46647f"},{"saturation":-10}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"color":"#101010"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#1e1e1e"}]}]*/


                var stylez =   [
              {
                  "stylers": [
                    { "weight": 1.3 },
                    { "invert_lightness": true },
                    { "visibility": "on" },
                    { "lightness": -56 },
                    { "hue": "#2c3e50" },
                    { "gamma": 1.45 }
                  ]
                }
            ];

                var mapOptions = {
                  zoom: 17,
                  center: center,
                  mapTypeControl: false,
                  scrollwheel:false,
                  disableDefaultUI: true,
                  mapTypeId: MY_MAPTYPE_ID
                };



                map = new google.maps.Map(document.getElementById("map_canvas"),
                    mapOptions);

                var styledMapOptions = {
                  name: "Мой стиль"
                };

                var jayzMapType = new google.maps.StyledMapType(stylez, styledMapOptions);

                map.mapTypes.set(MY_MAPTYPE_ID, jayzMapType);

               var img = './img/marker.png';
                var myMarker = new google.maps.Marker({
                  position:address,
                  map: map,
                  title: "Мы здесь!",
                  icon: img
                });
              }
     }

  }

  var keys = {37: 1, 38: 1, 39: 1, 40: 1};

  function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;
  }

  function preventDefaultForScrollKeys(e) {
      if (keys[e.keyCode]) {
          preventDefault(e);
          return false;
      }
  }
  function disableScroll() {
    if (window.addEventListener) // older FF
        window.addEventListener('DOMMouseScroll', preventDefault, false);
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
    window.ontouchmove  = preventDefault; // mobile
    document.onkeydown  = preventDefaultForScrollKeys;
  }

  function enableScroll() {
      if (window.removeEventListener)
          window.removeEventListener('DOMMouseScroll', preventDefault, false);
      window.onmousewheel = document.onmousewheel = null;
      window.onwheel = null;
      window.ontouchmove = null;
      document.onkeydown = null;
  }

/****************Просмотреть код*********************/

  $('.js-modal-order').click(function(){
    var divs = $(this).parents("form").find('.modal__form-control');
console.log(divs.length);

    if(divs.length == 1 && !checkPhoneOnly($(divs[0]).find('input').val())){
        showError($(divs[0]));
        return false;
    }
    if(divs.length == 4 && !checkEmail($(divs[0]).find('input').val())){
        showError($(divs[0]));
        return false;
    }
    if(divs.length == 4 && !checkPhone($(divs[1]).find('input').val())){
        showError($(divs[1]));
        return false;
    }
    if(divs.length == 4 && !+$(divs[2]).find('select option:selected').val()){
        showError($(divs[2]));
        return false;
    }
      // $.ajax({
      //     url: "/mail.php",
      //     data: $(this).closest('form').serialize()
      // });
  });

  function showError(elem){
      elem.addClass('error-committed');
        $('.error-committed .error').delay(600).animate({"opacity":"0"}, 1000).animate({"opacity":"1"},50);
        setTimeout(function(){
          $(".error-committed").removeClass('error-committed');
        }, 1600);
  };

  function checkPhone(input){
    // var patt = /^\s*$|^\s*(?:\+7\s*)?\(*\s*\d{3}\s*\)*\s*(?:\d\s*-*\s*){7}$/;
    var patt = /^(\s*(?:\+7\s*)?\(*\s*\d{3}\s*\)*\s*(?:\d\s*-*\s*){7})?$/;
    var res = patt.test(input);
    return res;
  };
  function checkPhoneOnly(input){
    var patt = /^\s*(?:\+7\s*)?\(*\s*\d{3}\s*\)*\s*(?:\d\s*-*\s*){7}$/;
    var res = patt.test(input);
    return res;
  };


  function checkEmail(input){
    var addr_pattern = /[0-9a-z_-]+@[0-9a-z_-]+\.[a-z]{2,5}/i;
    var res = addr_pattern.test(input);
    return res;
  };

  $('.btn-test-drive').on("click", function(){
    // console.log("btn-test-drive");
    // $("#modal_order").find("select").val(1);
    $("#modal_order").find("select option[value='1']").prop("selected", true);

  });
  $('.modal').on('hidden.bs.modal', function (e) {
    var divs = document.querySelectorAll(".form-group");
    if(divs) {
      $(divs).find('input').val('');
      // $(divs).find('select option:first').attr("selected", '1');
       $("#modal_order").find("select option[value='0']").prop("selected", true);
    }
  })

  $("#order_call").submit(function(e) {
      e.preventDefault();
      $("#order_call .btn-order").click();
  });


});
