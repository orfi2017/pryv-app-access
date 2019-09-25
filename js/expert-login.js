$("#login-button").click(function(){
    username = $('#expert-username').val();
    password = $('#expert-password').val();
    app_id = $('#app-id').val();
    auth_login(app_id, username, password);


});

function auth_login(app_id, username, password){
    $.ajaxSetup({
      contentType: "application/json; charset=utf-8",
      headers : {'Origin':'https://'+app_id+'.pryv.me'}
    });

    url = "https://"+username+".pryv.me/auth/login";
    creds = {
        "username": username,
        "password": password,
        "appId": app_id
    }

	// ajax the JSON to the server
	$.post(url, JSON.stringify(creds), function(d, status){
        // Use expert's token to create a stream dedicated to storing patient credentials:
        stream = {"id": "patients-credentials","name": "Patient accessses"};
        token = d['token'];
        username = creds['username'];
        create_stream(username, stream, token);
        alert(token);
	});

}

function create_stream(username, stream, token){
    url = "https://"+username+".pryv.me/streams";
    $.ajax({
        url: url,
        type: 'post',
        data: stream,
        headers: {"auth": token},
        dataType: 'json',
        success: function (data) {
            console.info(data);
        }
    });
//    $.ajaxSetup({
//      contentType: "application/json; charset=utf-8",
//      headers : {'auth':token}
//    });
//    $.post(url, JSON.stringify(stream), function(d, status){
//        alert(status);
//	});
}

