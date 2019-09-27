$(function() {
    var default_app_id = "test-app-id"
    url = window.location.href;
    url_splitted = url.split('?')
    expertToken = url_splitted[1].split('=')[1];
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
        app_id = $("#requestingAppId").val();
        permissions_data = $("#permissionsArea").val();
        console.log(app_id);
        data = {"requestingAppId":JSON.parse(app_id), "requestedPermissions":JSON.parse(permissions_data)}
        doWork(data) ;
    });
});

function doWork(data) {
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
           //generate link
           $("#sign_in").append("<a href=/?reqPermissions="+JSON.stringify(data)+"&expertToken="+expertToken+">Link to send to patients</a>");
//           $("#sign_in").append("<button onclick=window.open('"+url+"','popup','width=600,height=600'); return false;> Open Link in Popup </button>");
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
                $.post("https://0.0.0.0:8000/access", JSON.stringify(data), function(d,status){
                    console.log(status);
                })
            }
        });
    },5000);
}

