
window.onload = function() {
    const data = {
                  "requestingAppId": "test-app-id-2",
                  "requestedPermissions": [
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
                  ],
                  "languageCode": "fr"
                };
<!--    doWork(data)-->
};

function doWork(data) {
    $.ajaxSetup({
      contentType: "application/json; charset=utf-8"
    });
	var url = "https://reg.pryv.me/access"
	// ajax the JSON to the server
	$.post(url, JSON.stringify(data), function(d, status){
<!--	    console.log("Data: " + JSON.stringify(d) + "\nStatus: " + status);-->
        url=d['url'];
	    console.log("url: " + JSON.stringify(url) + "\nStatus: " + status);
        $("#sign_in").append("<a href="+url+"> <img src='../assets/logo-pryv.png'>");
        console.log("<a href="+url+"target='popup' onclick='window.open("+url+",'popup','width=600,height=600'); return false;> Open Link in Popup </a>")
        $("#sign_in").append("<button onclick=window.open('"+url+"','popup','width=600,height=600'); return false;> Open Link in Popup </button>");
	});
	// stop link reloading the page
 event.preventDefault();
}

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

$("#submitButton").click(function(){
    app_id = $("#requestingAppId").val();
    permissions_data = $("#permissionsArea").val();
    console.log(app_id);
    console.log(permissions_data);
    console.log(typeof permissions_data);
    data = {"requestingAppId":app_id, "requestedPermissions":permissions_data}
<!--    doWork(data) ;-->

});
