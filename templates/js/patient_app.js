$(function(){
    url = decodeURIComponent(window.location.href);
    url_params = url.split('?')[1].split('&');
    expert_url = url_params[0].split('=')[1];
    campaignId = url_params[1].split('=')[1];
    expertToken = url_params[2].split('=')[1];
    console.log(expert_url, expertToken, campaignId);

    get_event_one_call(expert_url, expertToken, campaignId);

//    requested_permissions = url_params[0].split('=')[1];
//    var i;
//    for (i=0; i<url_params.length; i++){
//        concept = url_params[0].split('=')[1];
//        level = url_params[1].split('=')[1];
//    }
//    console.log('url params',url_params);
//    console.log('permissions: ',requested_permissions);
//    request_access(JSON.parse(requested_permissions));
//    requested_permissions = JSON.parse(url_params[0].split('=')[1])
//    url_params = JSON.parse(url_params[0].split('=')[1])
//    requested_semantics = url_params.requestedPermissions;
//    req_app_id = url_params.requestingAppId
//    console.log('url params',url_params);
//    console.log('semantics',req_app_id);
//    console.log('semantics', requested_semantics);

//    streams = search_for_semantics(requested_semantics);
//    root_permissions = {"requestingAppId" : req_app_id,
//                        "requestedPermissions" :
//                            [{
//                                "streamId": "*", // some stream at root level or close or "*",
//                                "level": "read",
//                                "defaultName": "SemPryv"
//                            }]
//                        }
//    request_access(root_permissions)
});

function get_event_one_call(url, token, event_id){
    $.ajaxSetup({
      contentType: "application/json; charset=utf-8"
    });
    var url = 'https://'+url+'/events/'+event_id;
    $.ajax({
        url: url,
        type: 'get',
//        data: JSON.stringify(data),
        headers: {"authorization": token},
        dataType: 'json',
        success: function (resp) {
            requestedPermissions = resp['event']['content']['requestedPermissions'];
            appId = resp['event']['content']['appId'];
            consentText = resp['event']['content']['consentText'];
            data_for_request_access =
            {
                'requestingAppId': appId,
                'requestedPermissions':requestedPermissions,
                "clientData":
                {
                    "app-web-auth:description":
                    {
                        "type": "note/txt",
                        "content": consentText // consent text retrieved from
                    }
                }
            }
            console.log('data for create access: ',JSON.stringify(data_for_request_access));
            request_access(data_for_request_access);
        }
    });

}

function search_for_semantics(requested_semantics, streams) {
        console.log(typeof streams)
        for (i=0; i<streams.length; i++){
            console.log(streams[i].children)
        }
        // get streams for user that signed in
        // search for semantic terms in streams annotations
    }

function request_access(data) {
    $.ajaxSetup({
      contentType: "application/json; charset=utf-8"
    });
	var url = "https://reg.pryv.me/access"
	// ajax the JSON to the server
    $.ajax({
        url: url,
        type: 'post',
        data: JSON.stringify(data),
        dataType: 'json',
        success: function (resp) {
           url=resp['url'];
           start_polling(resp['poll']);
           var width = 600;
           var height = 600;
           var top = screen.width/2;
           var left = screen.height/2;
           window.open(url,'popup','width='+width+',height='+height+', top='+top+', left='+left);
        }
    });

	// stop link reloading the page
// event.preventDefault();
}

function start_polling(poll_url){
    console.log(poll_url);
    let intervalID = window.setInterval(function(){
        $.get(poll_url, function(d, status){
            console.log(d['status']);
            if (d['code'] == 200) {
                console.log('expert url', expert_url)
                var patientUsername = d['username'];
                var patientToken = d['token'];
                data = {"username":d['username'],"token" : d['token']};
                window.clearInterval(intervalID);
                store_patient_access(patientUsername, patientToken)
                console.log("post request");
//                streams = get_streams_for_user(username, token)
//                search_for_semantics(requested_semantics, streams);
            }
        });
    },5000);
}

//    re=requests.get(url="https://orfeas.pryv.me/streams",params={"auth":"cjzy2ioal04xj0e40zdcy4sku"})
function get_streams_for_user(username, token){
	username = 'orfi2019'
	token = 'ck1872ery4upf1kd3g9m3rhes'
	var url = "https://"+username+".pryv.me/streams"
	// ajax the JSON to the server
    $.ajax({
        url: url,
        type: 'get',
        data: {"auth" : token},
        dataType: 'json',
        success: function (resp) {
            return resp.streams;
        }
    });
}

function store_patient_access(expertToken, patientUsername, patientToken, permissions){

    console.log('create event', patientUsername, patientToken);
    //create event
    url = "https://"+expert_url+"/events";
    data = {
        "streamId": "expert-access-stream",
        "type": "access/pryv",
        "content": {
            "access": {
                "username" : patientUsername,
                "token" : patientToken,
                "type" : "shared",
                "name" : "For colleagues",
                "permissions" : permissions,
                "urlEndpoint" : patientUsername+"."

            }
        }
    };
    $.ajax({
        url: url,
        type: 'post',
        data: JSON.stringify(data),
        headers: {"authorization": expertToken},
        dataType: 'json',
        success: function (data) {
            $('#success_message').append('<p>patient credentials were saved successfully</p>')
        }
    });
}

