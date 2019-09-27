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
            $("#patients-creds").append(
            "<p>Create a stream dedicated to storing patient credentials:</p>" +
            "<p><textarea id='patients-stream' rows='10' cols='50'></textarea></p>"+
            "<p>Give a name for creating access for this stream: <textarea id='access-name' rows='1' cols='10'></textarea></p>"+
            "<p><button id='create-stream-access'>Create stream and access</button></p>"
            );
            $("#create-stream-access").click(function(){
                stream = $('#patients-stream').val();
                create_stream_access(username, stream, token);
            });
        }
    });
}

function create_stream_access(username, stream, token){
    url = "https://"+username+".pryv.me/streams";
    console.log(token, typeof token);
    $.ajax({
        url: url,
        type: 'post',
        data: stream,
        headers: {"authorization": token},
        dataType: 'json',
        success: function (data) {
            stream = JSON.parse(stream)
            console.log('stream created successfully', stream, typeof stream);
            name = $("#access-name").val();
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
    console.log();
    $.ajax({
        url: url,
        type: 'post',
        data: JSON.stringify(data),
        headers: {"authorization": token},
        dataType: 'json',
        success: function (data) {
//            location.href = "/index_permissions/?expertToken="+token+".html";
            window.location.href = "/request_permissions.html?expertToken="+token;
        }
    });
}
