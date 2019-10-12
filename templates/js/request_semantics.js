$(function() {
    url = window.location.href;
    arr = parse_username_token_from_url(url);
    expertUsername = arr[0];
    expertToken = arr[1];
    console.log(expertUsername, expertToken);
    var data_for_batch_call = create_batch_call_data();
    console.log(data_for_batch_call);

    batch_call(expertUsername, expertToken, data_for_batch_call);
//    var data_for_create_access = create_access_data();
//    create_access(username, token, data_for_create_access);

    var default_app_id = "test-app-id"
    url = window.location.href;
    url_splitted = url.split('?')
    expertToken = url_splitted[1].split('=')[1];
    var default_semantics = ['Heart', 'Weight', 'SNOMED-CT1298']
    $("#requestingAppId").val(JSON.stringify(default_app_id));
    $("#permissionsArea").val(JSON.stringify(default_semantics));

    $("#generate-link").click(function(){
        app_id = $("#requestingAppId").val();
        request_semantics = JSON.parse($("#permissionsArea").val());
        var permissions_data = create_permissions_data(request_semantics);
        console.log(permissions_data);
        data = {"requestingAppId":app_id, "requestedPermissions":permissions_data};
        generate_patient_link(app_id, JSON.parse(permissions_data));
    });
});

function parse_username_token_from_url(url){
    url_splitted = url.split('?')
    url_params = url_splitted[1].split('&');
    expertUsername = url_params[0].split('=')[1];
    expertToken = url_params[1].split('=')[1];
    return [expertUsername, expertToken]
}

function create_batch_call_data(){
    return [
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
          ]
}

function create_access_data(){
    return  {
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

function create_permissions_data(request_semantics){
    var permissions_data = {
            "requestedPermissions": [
                {
                    "streamId": "heart",
                    "level": "read"
                }
            ]
        };

    var i=0;
    console.log(request_semantics);
    for(i=0;i<request_semantics.length;i++){
        permissions_data["requestedPermissions"].push(
                  {
                    "concept": {
                                    "type": "keyword",
                                    "value": request_semantics[i]
                                },
                    "level": "read"
                  }
        );
    }
    return permissions_data;
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
//            window.location.href = "/request_semantics.html?expertToken="+token;
        },
        error: function(e){
            if(e['status']==400){
//                window.location.href = "/request_semantics.html?expertToken="+token;
            }
        }
    });
}

function generate_patient_link(app_id, permissions_data) {
    console.log(permissions_data.length);
    console.log(permissions_data);
    reqPermissions = {"requestingAppId": app_id, "requestedPermissions":permissions_data}
    link_text = '/patient_app.html?reqPermissions='+JSON.stringify(reqPermissions)+"&expertToken="+expertToken+"&consentText=https://pryv.com/terms-of-use";
    console.log(link_text);
    $("#link_area").append("<a href="+link_text+">Link for patients</a>");

//    var i=0;
//    for (i = 0; i < permissions_data.length; i++) {
//      link_text += "requestedPermissions["+i+"].concept="+permissions_data[i].concept+"&requestedPermissions["+i+"].level="+permissions_data[i].level+"&";
//    }
//    link_text += "expertToken="+expertToken+"&consentText=https://pryv.com/terms-of-use";

//    $.ajaxSetup({
//      contentType: "application/json; charset=utf-8"
//    });
//	var url = "https://reg.pryv.me/access"
////	 ajax the JSON to the server
//    $.ajax({
//        url: url,
//        type: 'post',
//        data: JSON.stringify(data),
//        dataType: 'json',
//        success: function (resp) {
//           $("#sign_in").append("<a href=/patient_app.html?reqAppIdSemantics="+JSON.stringify(data)+"&expertToken="+expertToken+">Link to send to patients</a>");
//           url=resp['url'];
////           start_polling(resp['poll']);
//           //generate link
////           $("#sign_in").append("<button onclick=window.open('"+url+"','popup','width=600,height=600'); return false;> Open Link in Popup </button>");
//        }
//    });
//
//	// stop link reloading the page
// event.preventDefault();
}

function start_polling(poll_url){
    console.log(poll_url);
    let intervalID = window.setInterval(function(){
        $.get(poll_url, function(d, status){
            console.log(d['status']);
            if (d['code'] == 200) {
                var username = d['username'];
                var token = d['token'];
                data = {"username":d['username'],"token" : d['token']};
                console.log(typeof data, data);
                window.clearInterval(intervalID);
                console.log("post request");
                $.post("https://0.0.0.0:8000/access", JSON.stringify(data), function(d,status){
                    console.log(status);
                })
            }
        });
    },5000);
}

