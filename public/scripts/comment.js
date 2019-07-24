/* eslint-disable no-undef */


$(function() {
    var commentForm;

    $("#new, #reply").on("click", () => {
        if(commentForm) commentForm.remove();

        commentForm = $("form.comment").clone(true, true);
        if($('#new').attr('id') === 'new'){
            commentForm.appendTo(".comment-list");
        }

        commentForm.css({ display: 'flex' });
    });

    $("form.comment .cancel").on("click", (e) => {
        e.preventDefault();
        commentForm.remove();
    });


    $("#publish-comment").on("click", e => {
        e.preventDefault();

        let data = {
            body: commentForm.find("textarea").val()
        };

        $.ajax({
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json",
            url: "/comment/add"
        }).done(function(data){
            console.log(data);
        });
    });

});

/* eslint-enable no-undef */