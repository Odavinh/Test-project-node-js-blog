/* eslint-disable no-undef */

$(function(){
    $("#publish").on("click", e => {
        e.preventDefault();

        var data = {
            edit: false,
            title: $("#post-title").val(),
            body:$("#post-body").val()
        };
        $.ajax({
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json",
            url: "/post/add"
        }).done(function(data) {
            console.log(data);
            if (!data.ok) {
              $(".post-form h2").after('<p class="error">' + data.error + "</p>");
            } else {
              $(".post-form h2").after(
                '<p class="ok"> Пост опублікований! </p>'
              );
            }
        });
    });

    $(".edit-button").on("click", e => {
      e.preventDefault();

      var data = {
          id: $("#post-id").val(),
          edit: true,
          title: $("#post-title").val(),
          body:$("#post-body").val()
      };
      $.ajax({
          type: "POST",
          data: JSON.stringify(data),
          contentType: "application/json",
          url: "/post/add"
      }).done(function(data) {
          console.log(data);
          if (!data.ok) {
            $(".post-form h2").after('<p class="error">' + data.error + "</p>");
          } else {
            $(".post-form h2").after(
              '<p class="ok"> Пост змінено! </p>'
            );
          }
      });
  });

    $('#fileinfo').on('submit', function(e) {
      e.preventDefault();
  
      var formData = new FormData(this);
  
      $.ajax({
        type: 'POST',
        url: '/upload/image',
        data: formData,
        processData: false,
        contentType: false,
        success: function(r) {
          console.log(r);
        },
        error: function(e) {
          console.log(e);
        }
      });
    });
});

/* eslint-enable no-undef */