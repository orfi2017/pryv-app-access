$("#login-button").click(function(){
    username = $('#expert-username').val();
    password = $('#expert-password').val();
    app_id = $('#app-id').val();
    auth_login(app_id, username, password);


});

function auth_login(app_id, username, password){
    $.ajaxSetup({
      contentType: "application/json; charset=utf-8"
//      headers : {'Origin':'https://'+app_id+'.pryv.me'}
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
            token = d['token'];
            username = creds['username'];
            // append stream for patients
            $("#patients-creds").append(
            "<p>Create a stream dedicated to storing patient credentials</p>" +
            "<p><textarea id='patients-stream' rows='10' cols='50'></textarea></p>"+
            "<p><button id='create-stream'>Create stream</button></p>"
            );
            $("#create-stream").click(function(){
                stream = $('#patients-stream').val();
                create_stream(username, stream, token);
            });
        }
    });
}

function create_stream(username, stream, token){
    url = "https://"+username+".pryv.me/streams";
    $.ajax({
        url: url,
        type: 'post',
        data: stream,
        headers: {"authorization": token},
        dataType: 'json',
        success: function (data) {
            alert('stream created successfully');
//            $.ajax
//            data = {
//                        "name": "to store patients accesses",
//                        "permissions": [{
//                            "streamId": "patients-credentials",
//                            "level": "contribute"
//                        }]
//                   };
//            create_access(username, data, token)
        }
    });
}

function create_access(username, data, token){
    url = "https://"+username+".pryv.me/accesses";
    $.ajax({
        url: url,
        type: 'post',
        data: JSON.stringify(data),
        headers: {"authorization": token},
        dataType: 'json',
        success: function (data) {
            console.info(data);
        }
    });
}


