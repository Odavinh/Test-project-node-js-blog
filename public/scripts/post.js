

$(function(){
    $("#publish").on("click", e => {
        e.preventDefault();

        let data = {
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
});