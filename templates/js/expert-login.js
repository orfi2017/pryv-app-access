$(function() {
    // TEST
    $("#login-button").click(function(){
        username = $('#expert-username').val();
        password = $('#expert-password').val();
        app_id = $('#app-id').val();
        auth_login(app_id, username, password);
    });
})


function auth_login(app_id, username, password){
    $.ajaxSetup({
      contentType: "application/json; charset=utf-8"
    });

    url = "https://"+username+".pryv.me/auth/login";
    creds = {
        "username": username,
        "password": password,
        "appId": app_id
    }

    $.ajax({
        url: url,
        type: 'post',
        data: JSON.stringify(creds),
        headers: {'Origin':'https://'+app_id+'.pryv.me'},
        dataType: 'json',
        success: function (d) {
            expertToken = d['token'];
            window.location.href = "/request_semantics.html?expertUsername="+username+"&expertToken="+expertToken;
        }
    });
}

function delete_stream(username, stream_id, token){
    url = "https://"+username+".pryv.me/streams/"+stream_id;
    data = {'id':token}
    $.ajax({
        url: url,
        type: 'delete',
        headers: {"authorization": token},
        dataType: 'json',
        success: function (data) {
            window.location.href = "/request_semantics.html?expertToken="+token;
        },
        error: function(e){
            console.log(e)
        }
    });
}


