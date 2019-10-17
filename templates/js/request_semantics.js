$(function() {
    url = window.location.href;
    url_params = parse_username_token_from_url(url);
    expertUsername = url_params[0];
    expertToken = url_params[1];
    console.log('username: ',expertUsername, 'token: ', expertToken);
    var data_for_batch_call = create_batch_call_data();
    console.log(data_for_batch_call);
    batch_call(expertUsername, expertToken, data_for_batch_call);
    var data_for_create_access = create_access_data();
    create_access(expertUsername, expertToken, data_for_create_access);

    app_id = $("#requestingAppId").val();
    consentText = 'https://pryv.com/terms-of-use/';
//    request_semantics = JSON.parse($("#permissionsArea").val());
    default_permissions = create_permissions_data();
//    default_semantics = ['Heart','Weight'];
    $("#permissionsArea").val(JSON.stringify(default_permissions));
    permissions_data = JSON.parse($("#permissionsArea").val());
//    permissions_data = default_permissions;
    event_data = create_event_data(permissions_data, consentText, app_id);
    create_event(expertUsername, expertToken, event_data);
});

function parse_username_token_from_url(url){
    var url_splitted = url.split('?')
    var url_params = url_splitted[1].split('&');
    expertUsername = url_params[0].split('=')[1];
    expertToken = url_params[1].split('=')[1];
    return [expertUsername, expertToken]
}

function create_batch_call_data(){
    return [
            {
                "method": "streams.create",
                "params": {
                    "id": "sempryv-semantics-app",
                    "name": "Sempryv app"
                }
            },
            {
                "method": "streams.create",
                "params": {
                            "id": "sempryv-semantics-app-description",
                            "parentId": "sempryv-semantics-app",
                            "name": "Sempryv app description"
                          }
            },
            {
                "method": "streams.create",
                "params": {
                            "id": "sempryv-semantics-app-patient-accesses",
                            "parentId": "sempryv-semantics-app",
                            "name": "Sempryv Patient accesses"
                          }
            }
          ]
}

function create_access_data(){
    return  {
                "name": "to store patients accesses",
                "permissions": [{
                            "streamId": "sempryv-semantics-app-description",
                            "level": "read"
                            },
                            {
                            "streamId": "sempryv-semantics-app-patient-accesses",
                            "level": "contribute"
                            }]
            }
}

function create_permissions_data(){
    return [
                {
                    "streamId": "heart",
                    "level": "read",
                    "defaultName": "Heart"
                },
                {
                     "streamId": "diary",
                     "level": "read",
                     "defaultName": "Journal"
                 },
                 {
                     "streamId": "position",
                     "level": "contribute",
                     "defaultName": "Position"
                 }
          ];
}



function batch_call(username, token, data){
    $.ajaxSetup({
      contentType: "application/json; charset=utf-8"
    });
    url = "https://"+username+".pryv.me";
    $.ajax({
        url: url,
        type: 'post',
        data: JSON.stringify(data),
        headers: {"authorization": token},
        dataType: 'json',
        success: function (data) {
            console.log('BC response', data)
        }
    });
}


function create_access(username, token, data){
    url = "https://"+username+".pryv.me/accesses";
    $.ajax({
        url: url,
        type: 'post',
        data: JSON.stringify(data),
        headers: {"authorization": token},
        dataType: 'json',
        success: function (data) {
            console.log('access created for token', token);
//            window.location.href = "/request_semantics.html?expertToken="+token;
        },
        error: function(e){
            if(e['status']==400){
            console.log('access has been already created for token', token);
//                window.location.href = "/request_semantics.html?expertToken="+token;
            }
        }
    });
}

function create_event_data(requestedPermissions, consentText, appId){
    return    {
        "streamId": "sempryv-semantics-app-description",
        "type": "campaign/sempryv",
        "content": {
            "requestedPermissions": requestedPermissions,
            "consentText": consentText,
            "appId": appId
        }
    }
}

function create_event(username, token, data){
    console.log('create event', username, token, data);

    url = "https://"+username+".pryv.me/events";
    $.ajax({
        url: url,
        type: 'post',
        data: JSON.stringify(data),
        headers: {"authorization": token},
        dataType: 'json',
        success: function (data) {
            console.log('response event id', data['event']['id']);
            event_id = data['event']['id'];
            $("#generate-link").click(function(){
                link_text = '/patient_app.html?url='+expertUsername+".pryv.me&eventId="+event_id+"&expertToken="+expertToken;
                $("#link_area").append("<a href="+link_text+">Link for patients</a>");
            });
        }
    });
}




//function create_permissions_data(request_semantics){
//    var permissions_data = {
//            "requestedPermissions": [
//                {
//                    "streamId": "heart",
//                    "level": "read"
//                }
//            ]
//        };
//
//    var i=0;
//    for(i=0;i<request_semantics.length;i++){
//        permissions_data["requestedPermissions"].push(
//                  {
//                    "concept": {
//                                    "type": "keyword",
//                                    "value": request_semantics[i]
//                                },
//                    "level": "read"
//                  }
//        );
//    }
//    return permissions_data;
//}
