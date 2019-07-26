/* eslint-disable no-undef */


$(function() {
    var commentForm;
    var parentId;


    $("#new, #reply").on("click", () => {

        if (commentForm) {
            commentForm.remove();
        }
        parentId = null;
    
        commentForm = $('.comment').clone(true, true);
    
        if ($("#new").attr('id') === "new") {
            commentForm.appendTo('.comment-list');
            $("#new").hide();
        } else {
            var parentComment = $(this).parent();
            parentId = parentComment.attr('id');
            $(this).after(commentForm);
        }
      
        commentForm.css({ display: 'flex' });
    });

    $("form.comment .cancel").on("click", (e) => {
        e.preventDefault();
        commentForm.remove();
        $("#new").show();
    });


    $("#publish-comment").on("click", e => {
        e.preventDefault();

        let data = {
            post: $(".comments").attr("id"),
            body: commentForm.find("textarea").val(),
            parent: parentId
        };
        $.ajax({
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json",
            url: "/comment/add"
        }).done(function(data){
           if(!data.ok){
               if(data.error === undefined){
                   Data.error = "Помилка обробки повідомлення!";
               }
               $(commentForm).prepend('<p class="commentError">'+data.error+'</p>');
           }else{
            $(commentForm).prepend('<p class="commentOk">Коментарій відправлено!</p>');
           }
           console.log(data.ok);
        });
    });

});

/* eslint-enable no-undef */