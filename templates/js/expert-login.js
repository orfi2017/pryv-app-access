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
            stream_id = "patients-credentials"
            delete_stream(username, stream_id, token);
            stream_for_access = {"id": "patients-credentials", "name": "Patient accessses"}
            create_stream_access(username, stream_for_access, token)
        }
    });
}

function create_stream_access(username, stream, token){
    url = "https://"+username+".pryv.me/streams";
    console.log(token, typeof token);
    $.ajax({
        url: url,
        type: 'post',
        data: JSON.stringify(stream),
        headers: {"authorization": token},
        dataType: 'json',
        success: function (data) {
            stream = JSON.parse(stream)
            console.log('stream created successfully', stream, typeof stream);
            name = "to store patients accesses";
            data = {
                        "name": name,
                        "permissions": [{
                            "streamId": stream.id,
                            "level": "contribute"
                        }]
                   };
            create_access(username, data, token)
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
            window.location.href = "/request_permissions.html?expertToken="+token;
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
            window.location.href = "/request_permissions.html?expertToken="+token;
        },
        error: function(e){
            console.log(e)
        }
    });
}


