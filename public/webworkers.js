var w;
function startWorker() {
    if(typeof(Worker) !== "undefined") {
        if(typeof(w) == "undefined") {
            w = new Worker("/thread.js?"+timeout);
        }
        w.onmessage = function(event) {
            document.getElementById("workers").innerHTML += event.data;
            if(typeof event.data === 'string') document.getElementById("workers").innerHTML += '<br/>';
        };
    } else {
        document.getElementById("workers").append("Sorry! No Web Worker support.");
    }
}

function stopWorker() { 
    w.terminate();
    w = undefined;
}