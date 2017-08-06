if(!("WebSocket" in window)){
    document.getElementById("socket").innerHTML = "您的瀏覽器不支援socket";
}else{ 
    connect();
} 

function connect(){  
    var socket;  
    var host = "ws://localhost:2999/socket/server/startDaemon.php";  

    try{  
        var socket = new WebSocket(host);  
        message('<p class="event">Socket Status: '+socket.readyState);
        //連線時...
        socket.onopen = function(){  
            message('<p class="event">Socket Status: '+socket.readyState+' (open)');  
        }  
        //server端傳回訊息時...
        socket.onmessage = function(msg){  
            message('<p class="message">Received: '+msg.data);  
        }  
        //連線關閉時...
        socket.onclose = function(){  
            message('<p class="event">Socket Status: '+socket.readyState+' (Closed)');  
        }           
    } catch(exception){  
        message('<p>Error'+exception);  
    } 
    //client端送出訊息
    function send(){  
        var text = $('#text').val();  
        if(text==""){  
            message('<p class="warning">Please enter a message');  
            return ;  
        }  
        try{  
            socket.send(text);  
            message('<p class="event">Sent: '+text)  
        } catch(exception){  
            message('<p class="warning">');  
        }  
        $('#text').val("");  
    }  
  
    function message(msg){  
        $('#chatLog').append(msg+'</p>');  
    }  

    $('#text').keypress(function(event) {  
        if (event.keyCode == '13') {  
        send();  
        }  
    });     

    $('#disconnect').click(function(){  
        socket.close();  
    });   
}