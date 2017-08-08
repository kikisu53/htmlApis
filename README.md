# htmlApis
some test using Web Workers, Server-Sent Event, Websocker

# Web Workers
1. 建立一個物件 Worker 之後，瀏覽器就會根據路徑參數，非同步的下載這一 script ，接著瀏覽器就可以開始跟他溝通了。

	```
	// 下載到client端的js中宣告物件
	var w = new Worker("/thread.js");
	// 透過 onmessage 監聽事件
	w.onmessage = function(event){}
	// 停止監聽事件
	w.terminate();
	```
	
2. 監聽 client 端訊息的物件。	
2. web workers 是在背景執行緒 (Thread) 執行，有 dedicated worker 和 shared worker 兩種，前者只能被產生它的檔案讀取，後者可以共用，但方式比較複雜。上面的例子是 dedicated worker 。
3. 相對主執行緒， web workers 權限較小，例如透過 geolocation 取得位置，就只能在主執行緒中執行， web workers 無法處理。
2. 更多細節：[MDN Web docs: Web Workers API](https://developer.mozilla.org/zh-TW/docs/Web/API/Web_Workers_API/Using_web_workers)，[Web Worker 經驗分享(一)](http://ithelp.ithome.com.tw/articles/10118851)，[html5rocks: Web Workers](https://www.html5rocks.com/zh/tutorials/workers/basics/)

# Server-Sent Event
1. 監聽 server 端訊息的物件。
2. 簡單來說，是單向的 WebSocket ，但使用的協定不同。
2. 實際上運作屬於 long polling。
2. Server-Sent Event 、 WebSocket 、 long polling

	| Server-Sent Event | WebSocket | long polling |
	|---|---|---|
	|單向：Server-Side -> Client-Side | 雙向：Server-Side -> Client-Side | 雙向 |
	|HTTP 協定（會有timeout)| 獨立協定(長時間連線) | HTTP 協定(會有timeout)|
	
2. 資料傳送型態必須為 text/event-stream ，資料必須為字串。
3. 更多細節：[HTML5 - Server-Send Event (SSE)](http://limitedcode.blogspot.tw/2016/12/html5-server-send-event-sse.html)
3. 補充資料（程式碼中用到的方法）
	* [set header](https://developer.mozilla.org/en-US/docs/Web/API/Headers)
	* [nodejs flush用法](https://expressjs.com/en/resources/middleware/compression.html)
	* [事件監聽 EventEmitter](http://www.runoob.com/nodejs/nodejs-event.html)
	* [透過javascript解析url 取得get參數](http://blog.xuite.net/ahdaa/blog1/31825228)

# Websocker
http://ithelp.ithome.com.tw/articles/10102394
http://blog.bingo929.com/html5-websockets.html
http://www.jollen.org/blog/2014/07/nodejs-websocket-server.html

## 關於postMessage
http://xyz.cinc.biz/2014/05/html5-postmessage-text.html
http://www.cnblogs.com/dbylk/p/4904106.html