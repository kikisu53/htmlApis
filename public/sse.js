var s ={};
function startSSE(c){
    console.log(c+'start')
    if(typeof(EventSource) !== "undefined") {
        s[c] = new EventSource("/sse/"+c);
        s[c].onmessage = function(event) {
            console.log(event)
            document.getElementById(c).innerHTML += event.data + "<br>";
        };
    } else {
        document.getElementById(c).innerHTML = "Sorry, your browser does not support server-sent events...";
    }
}

function stopSSE(c){
    s[c].close();
    s[c] = undefined;
}