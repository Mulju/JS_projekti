'use strict'
//Funktio, joka tapahtuu kun scrollataan
$(document).ready(function ($) {
  $(window).on("scroll", function () {
    //Lisää tight classin, kun mennään sivun loppuun. Piilottaa nuolen.
    if (
      $(window).scrollTop() + $(window).height() >
      $(".wrapper").outerHeight()
    ) {
      $("body").addClass("tight");
      $(".arrow").hide();
    } else {
      $("body").removeClass("tight");
      $(".arrow").show();
    }
  });
//Kun olet footterissa ja kilkkaat wrapperia niin footer menee takaisin piiloon (hieno animaatio)
  $("html").on("click", "body.tight .wrapper", function () {
    $("html, body").animate(
      {
        scrollTop: $(".wrapper").outerHeight() - $(window).height()
      },
      500
    );
  });
});
//Kun nuolta klikataan niin pääsee footteriin ilman, että scrollaa
$(".arrow").click(function () {
  $("html").animate({ scrollTop: $("html").prop("scrollHeight") }, 1200);
});
