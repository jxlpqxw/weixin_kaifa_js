var http = require('http');
var parseUrl = require('url').parse;//返回的是函数地址，直接赋给parseUrl，可以直接使用

var NEWS = {
     1:'这里是第一篇新闻的内容',
     2:'这里是第二篇新闻的内容',
     3:'这里是第三篇新闻的内容'
};
function getNews(id){
	return NEWS[id] || '文章不存在';
}
var server = http.createServer(function (req,res){
    
    function send (html){
         res.writeHead(200,{
         	'content-type':'text/html;charset=utf-8'
         });
         res.end(html);


    }
    var info = parseUrl(req.url,true);
    req.pathname = info.pathname;
    req.query = info.query;

    if (req.url === '/'){
         send('<ul>'+
         	'<li><a href="/news?type=1&id=1">新闻一</a></li>'+
            '<li><a href="/news?type=1&id=2">新闻二</a></li>'+
            '<li><a href="/news?type=1&id=3">新闻三</a></li>'+
            '</ul>');


    }else if(req.pathname === '/news'&& req.query === '1') {
        send(getNews(req.query.id));

    }else{
        send('<h1>文章不存在！</h1>');
    }



});
server.listen(3001);