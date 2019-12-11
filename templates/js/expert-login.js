$(function() {
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
    url = "https://"+username+".pryv.hevs.ch/auth/login";
    creds = {
        "username": username,
        "password": password,
        "appId": app_id
    }

    $.ajax({
        url: url,
        type: 'post',
        data: JSON.stringify(creds),
        headers: {'Origin':'https://'+app_id+'.pryv.hevs.ch'},
        dataType: 'json',
        success: function (d) {
            expertToken = d['token'];
            window.location.href = "/request_semantics.html?expertUsername="+username+"&expertToken="+expertToken;
        }
    });
}