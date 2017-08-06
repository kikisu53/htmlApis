var express = require('express');
var fs = require('fs');
var EventEmitter = require('events').EventEmitter,
    bomb = new EventEmitter();

var app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));

const timeout = 5000;

app.get('/', (req,res)=> res.render('compare', {timeout: timeout}));
app.get('/ssefilechange', (req,res)=> res.render('ssefilechange'));

//SSE必作設定
const ssehead = {
        'content-type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'charset': "UTF-8"
    };

// case 1:基本用法
app.get('/sse/case1',(req,res) => {
    res.set(ssehead);
    var i=0;
    var timer = setInterval( () => {
        i++;
        var obj = {
            order: i, 
            time: new Date().toUTCString()
        };
        // Server-Side 送出的資料 MIME TYPE 為 text/event-stream，資料結構如下
        // 1. event：事件類別，意思是要傳送給哪個事件，預設onmessage。
        // 2. data：資料，只能放字串
        // 3. retry：傳送時間間隔，預設3000毫秒。（目前測試：不管設值為何，前端反應相同)
        // 4. id：事件ID，該欄位如果有設定的話，瀏覽器在接收到 Server-Side 資料後會在 Buffer 紀錄 last event id 的欄位，
        //     如果斷線的話，瀏覽器會在 Request 加入 last event id，告知 Server-Side 從這個事件開始重送。
        // * 欄位結束後要加入\n，data 欄位放最後，並加入 \n\n，代表結束
        res.write('data:'+JSON.stringify(obj)+'\n\n');
        // 送出暫存 !!! this is the important part
        res.flushHeaders(); //flush is deprecated. Use flushHeaders instead.
    },timeout)
    //前端觸發 close 事件時，清除 timer
    res.on('close', function () {
        clearInterval(timer);
    })
});

// case 2:把 setInterval 放在外面，透過監聽的方式處理（EventEmitter）
app.get('/sse/case2',(req,res) => {
    res.set(ssehead);
    var listen1 = (obj) => {
        res.write('data:'+JSON.stringify(obj)+'\n\n');
        res.flushHeaders();
    }
    bomb.on('datachnage', (obj) => listen1(obj)); //.on = .addListener
    res.on('close', function () {
        bomb.removeListener('datachange', listen1);
    })
});

app.get('/sse/case3',(req,res) => {
    res.set(ssehead);
    fs.watch('./data/ssedata.json', (eventType, filename) => {
        // console.log(`event type is: ${eventType}`);
        fs.readFile('./data/ssedata.json', (err, data) => {
            if (err) throw err;
            // console.log(data.toString());  //typeof = buffur
            res.write('data:'+data+'\n\n');
            res.flushHeaders();
        });
    });
    res.on('close', function () {
        fs.unwatchFile('./data/ssedata.json');
    })
});
// Note: fs.watch() is more efficient than fs.watchFile and fs.unwatchFile. 
// fs.watch should be used instead of fs.watchFile and fs.unwatchFile when possible.

var count = 0;
setInterval( () => {
    count++;
    var obj = {
        order: count, 
        time: new Date().toUTCString()
    }
    bomb.emit('datachnage', obj); //for /sse/case2
    fs.writeFile('./data/ssedata.json', JSON.stringify(obj), (err) => 
        err ? console.log('fs.writeFile: '+err) : ''
    ); //for /sse/case3
},timeout);

app.listen(2999);