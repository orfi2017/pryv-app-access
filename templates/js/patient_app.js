$(function(){
    url = decodeURIComponent(window.location.href);
//    console.log(url.split('?')[1]);
    url_params = url.split('?')[1].split('&')
//    url_splitted_again = url_splitted[1].split('&')
    requested_permissions = JSON.parse(url_params[0].split('=')[1])
    req_app_id = requested_permissions.requestingAppId
    requested_semantics = JSON.parse(url_params[0].split('=')[1]).requestedPermissions
    console.log(req_app_id);
//    streams = search_for_semantics(requested_semantics);
    root_permissions = {"requestingAppId" : req_app_id,
                        "requestedPermissions" :
                            [{
                                "streamId": "*", // some stream at root level or close or "*",
                                "level": "read",
                                "defaultName": "SemPryv"
                            }]
                        }
    request_access(root_permissions)
});

function search_for_semantics(requested_semantics, username, user_token) {
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
           window.open(url,'popup','width=600,height=600');
        }
    });

	// stop link reloading the page
 event.preventDefault();
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
                streams = get_streams_for_user(username, token)
                console.log(streams)
//                search_for_semantics(requested_semantics);
//                $.post("https://0.0.0.0:8000/access", JSON.stringify(data), function(d,status){
//                    console.log(status);
//                })
            }
        });
    },5000);
}

//    re=requests.get(url="https://orfeas.pryv.me/streams",params={"auth":"cjzy2ioal04xj0e40zdcy4sku"})
function get_streams_for_user(username, token){
	var url = "https://"+username+".pryv.me/streams"
	// ajax the JSON to the server
    $.ajax({
        url: url,
        type: 'get',
        data: {"auth" : token},
        dataType: 'json',
        success: function (resp) {
            console.log(resp);
        }
    });
}


