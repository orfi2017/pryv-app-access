$(function() {
    var default_app_id = "test-app-id"

    var default_permissions_data= [
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
      ]

    $("#requestingAppId").val(JSON.stringify(default_app_id));

    $("#permissionsArea").val(JSON.stringify(default_permissions_data));

    $("#request-access").click(function(){
        alert('clicked');
        app_id = $("#requestingAppId").val();
        permissions_data = $("#permissionsArea").val();
        console.log(app_id);
        console.log(permissions_data);
        console.log(typeof permissions_data);
        data = {"requestingAppId":JSON.parse(app_id), "requestedPermissions":JSON.parse(permissions_data)}
        doWork(data) ;
    });
});

//
//
//window.onload = function() {
//    const data = {
//                  "requestingAppId": "test-app-id-2",
//                  "requestedPermissions": [
//                    {
//                      "streamId": "diary",
//                      "level": "read",
//                      "defaultName": "Journal"
//                    },
//                    {
//                      "streamId": "position",
//                      "level": "contribute",
//                      "defaultName": "Position"
//                    }
//                  ]};
//<!--    doWork(data)-->
//};

function doWork(data) {
    $.ajaxSetup({
      contentType: "application/json; charset=utf-8"
    });
	var url = "https://reg.pryv.me/access"
	// ajax the JSON to the server
	$.post(url, JSON.stringify(data), function(d, status){
       url=d['url'];
 	   start_polling(d['poll']);
       $("#sign_in").append("<button onclick=window.open('"+url+"','popup','width=600,height=600'); return false;> Open Link in Popup </button>");

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
                $.post("https://0.0.0.0:8000/access", JSON.stringify(data), function(d,status){
                    console.log(status);
                })
            }
        });
    },5000);
}

