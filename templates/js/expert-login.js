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
            expertToken = d['token'];
            window.location.href = "/request_semantics.html?expertUsername="+username+"&expertToken="+expertToken;
            data_for_batch_call = [
                                    {
                                        "method": "streams.create",
                                        "params": {
                                            "id": "campaign-123",
                                            "name": "Campaign name"
                                        }
                                    },
                                    {
                                        "method": "streams.create",
                                        "params": {
                                                    "id": "campaign-123-description",
                                                    "parentId": "campaign-123",
                                                    "name": "Campaign description"
                                                  }
                                    },
                                    {
                                        "method": "streams.create",
                                        "params": {
                                                    "id": "campaign-123-patient-accesses",
                                                    "parentId": "campaign-123",
                                                    "name": "Patient accesses"
                                                  }
                                    }
                                  ];
        console.log(data_for_batch_call)
//            batch_call(username, expertToken, data_for_batch_call);

            // append stream for patients
//            stream_id = "patients-credentials"
//            delete_stream(username, stream_id, token);
//            stream_for_access = {"id": "patients-credentials", "name": "Patient accessses"}
//            create_stream_access(username, stream_for_access, token)
        }
    });
}

function batch_call(username, token, data){
    url = "https://"+username+".pryv.me";
    $.ajax({
        url: url,
        type: 'post',
        data: JSON.stringify(data),
        headers: {"authorization": token},
        dataType: 'json',
        success: function (data) {
            console.log('BC response', data)
//            stream = JSON.parse(stream)
            data = {
                        "name": "to store patients accesses",
                        "permissions": [{
                                        "streamId": "campaign-123-description",
                                        "level": "read"
                                        },
                                        {
                                        "streamId": "campaign-123-patient-accesses",
                                        "level": "contribute"
                                        }]
                    }
//            create_access(username, token, data);
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
//            stream = JSON.parse(stream)
            console.log('stream created successfully', stream, typeof stream);
            name = "to store patients accesses-2";
//            data = {
//                        "name": name,
//                        "permissions": [{
//                            "streamId": stream.id,
//                            "level": "contribute"
//                        }]
//                   };
            create_access(username, stream, token)
        }
    });
}

function create_access(username, token, data){
    console.log('create access')
    url = "https://"+username+".pryv.me/accesses";
    $.ajax({
        url: url,
        type: 'post',
        data: JSON.stringify(data),
        headers: {"authorization": token},
        dataType: 'json',
        success: function (data) {
            console.log('access created for token', token);

//            if ('error' in data['results'][0]){
//                console.log('response error',data['results'][0]);
//            }

            window.location.href = "/request_semantics.html?expertToken="+token;
        },
        error: function(e){
            if(e['status']==400){
                window.location.href = "/request_semantics.html?expertToken="+token;
            }
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


