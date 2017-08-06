var timeout = location.search.substr(1);
function timenow() {
    postMessage(new Date().toUTCString());
    setTimeout("timenow()",timeout);
}
timenow();

//navigator.geolocation belongs to navigator in the main thread only, but doesn't belong to navigator in the worker thread.
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position =>
                postMessage("My GPS : " + position.coords.latitude + 
                    ", " + position.coords.longitude)
        )
    }else{
        postMessage(' navigator.geolocation = '+navigator.geolocation )
    }
    setTimeout("getUserLocation()",timeout);
}
getUserLocation();