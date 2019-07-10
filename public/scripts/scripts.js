/* eslint-disable no-undef */

$(function() {
  let flag = true;
  $(".switch-button").on("click", function(e) {
    e.preventDefault();

    $("input").val("");
    $("p.error").remove();
    $("error").removeClass("error");

    if (flag) {
      flag = false;
      $(".register").show("slow");
      $(".login").hide();
    } else {
      flag = true;
      $(".login").show("slow");
      $(".register").hide();
    }
  });

  $(".register-button").on("click", function(e) {
    e.preventDefault();

    $("p.error").remove();
    $("p.ok").remove();
    $("error").removeClass("error");

    const data = {
      login: $("#register-login").val(),
      password: $("#register-password").val(),
      passwordComfirm: $("#register-password-confirm").val()
    };

    $.ajax({
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      url: "/api/auth/register"
    }).done(function(data) {
      console.log(data);
      if (!data.ok) {
        $(".register h2").after('<p class="error">' + data.error + "</p>");
      } else {
        $(".register h2").after(
          '<p class="ok"> Ауторизация прошла успешно! </p>'
        );
      }
    });
  });

  $(".login-button").on("click", function(e) {
    e.preventDefault();

    $("p.error").remove();
    $("p.ok").remove();
    $("error").removeClass("error");

    const data = {
      login: $("#login-login").val(),
      password: $("#login-password").val()
    };

    $.ajax({
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      url: "/api/auth/login"
    }).done(function(result) {
      console.log(result);
      if (!result.ok) {
        $(".login h2").after('<p class="error">' + result.error + "</p>");
      } else {
        $(location).attr("href", "/");
      }
    });
  });
});

/* eslint-enable no-undef */
