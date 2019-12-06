var data_for_request = null;
var expert_url = null;

$(function(){
    url = decodeURIComponent(window.location.href);
    url_params = url.split('?')[1].split('&');
    expert_url = url_params[0].split('=')[1];
    campaignId = url_params[1].split('=')[1];
    expertToken = url_params[2].split('=')[1];
    appId = url_params[3].split('=')[1];

    console.log(expert_url, expertToken, campaignId, appId);
    get_event_one_call(expert_url, expertToken, campaignId, appId);
    $("#requestExpert").html(expert_url.split('.')[0]);
    $("#signin_button").click(function(){
        $("#spinner").show();
        $("#signin_button").hide();
       request_access(data_for_request);
    });
});

function get_event_one_call(url, token, event_id, app_id){
    console.log('get_event_one_call');
    $.ajaxSetup({
      contentType: "application/json; charset=utf-8"
    });
    var url = 'https://'+url+'/events/'+event_id;
    $.ajax({
        url: url,
        type: 'get',
        headers: {"authorization": token},
        dataType: 'json',
        success: function (resp) {
        console.log('response from event one call: ', JSON.stringify(resp));
            requestedPermissions = resp['event']['content']['requestedPermissions'];
            consentText = resp['event']['content']['consentText'];
            data_for_request_access =
            {
                'requestingAppId': app_id,
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
            $("#requestingAppId").html(data_for_request_access.requestingAppId);
            data_for_request_access.requestedPermissions.forEach(function (element) {
//                let permission = "<tr><td>"+element.streamId+"</td><td>"+element.level+"</td><td>"+element.defaultName+"</td></tr>"
                let permission = "<tr><td>"+JSON.stringify(element.concept.value)+"</td><td>"+element.level+"</td><td>"+element.defaultName+"</td></tr>"
                $("#requestedPermissions").append(permission);
            });
            data_for_request = data_for_request_access;
        }
    });
}

function request_access(data) {
    $.ajaxSetup({
      contentType: "application/json; charset=utf-8"
    });
//	var url = "https://reg.pryv.me/access"
	var url = "https://reg.pryv.hevs.ch/access"
	// ajax the JSON to the server
    $.ajax({
        url: url,
        type: 'post',
        data: JSON.stringify(data),
        dataType: 'json',
        success: function (resp) {
            console.log('success from request access')
            url=resp['url'];
            url_modified =url.substring(0,10)+'2'+url.substring(10,url.length)
            start_polling(resp['poll']);
            var width = 600;
            var height = 600;
            var top = screen.width/2;
            var left = screen.height/2;
            window.open(url_modified,'popup','width='+width+',height='+height+', top='+top+', left='+left);
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
                store_patient_access(expertToken, patientUsername, patientToken)
                console.log("post request");
                $("#spinner").hide();
                $("#successMsg").html("Patient credentials for "+ d['username'] +" were saved successfully in "+ expert_url.split('.')[0] +" account");


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
    $('#success_message').append('<p>patient credentials were saved successfully</p>');
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
            $('#success_message').append('<p>patient credentials were saved successfully</p>');
        }
    });
}

