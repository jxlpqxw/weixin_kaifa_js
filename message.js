var PORT=7778;
var http=require('http');
var qs=require('qs');
var TOKEN='qxw';

function checkSignature(params,token) {
    var key=[token,params.timestamp,params.nonce].sort().join('');
    var sha1=require('crypto').createHash('sha1');
    sha1.update(key);
    return sha1.digest('hex')==params.signature;

}

var server=http.createServer(function (request,response) {
    var query=require('url').parse(request.url).query;
    var params=qs.parse(query);

    if (!checkSignature(params,TOKEN)){
        response.end('signature fail');//签名如果不对，结束请求并返回
        return;
    }

    if (request.method=='GET'){
        response.end(params.echostr);//如果请求是GET，返回echostr用于通过服务器有效校验
    }else {                          //否则是微信给开发者服务器的POST请求
        var postdata="";
        request.addListener("data",function (postchunk) {
            postdata+=postchunk;

        });

        request.addListener("end",function(){
        var parseString = require('xml2js').parseString;
        //将XML数据通过xml2js模块解析成json格式
        parseString(postdata,function(err,result){
        if (!err) {
            console.log(result)
            response.write(replyText(result));//通过response.write将数据返回给用户
            response.end('success');

        }
    });
});
    }

});

server.listen(PORT);
console.log("Server running at port:"+PORT+".");


function replyText(msg) {
    var msgtype=msg.xml.MsgType[0];
    switch (msgtype){
        case 'text':
            feedback='文本消息';
            break;
        case 'image':
            feedback='图片消息';
            break;
        case 'shortvideo':
            feedback='小视频';
            break;
        case 'video':
            feedback='视频消息';
            break;
        case 'voice':
            feedback='语音消息';
            break;
        case 'location':
            feedback='你所在位置的  '+'经度: '+msg.xml.Location_Y[0]+'纬度: '+msg.xml.Location_X[0];
            break;
        case 'link':
            feedback='链接消息';
            break;
        default:
            feedback='未知类型消息'
    }

    var tmpl=require('tmpl');
    //通过tmpl模块来解析xml中的内容
    var replyTmpl='<xml>'+
        '<ToUserName><![CDATA[{toUser}]]></ToUserName>'+
        '<FromUserName><![CDATA[{fromUser}]]></FromUserName>'+
        '<CreateTime><![CDATA[{time}]]></CreateTime>>'+
        '<MsgType><![CDATA[{type}]]></MsgType>>'+
        '<Content><![CDATA[{content}]]></Content>>'+
        '</xml>>';

    return tmpl(replyTmpl,{
        toUser:msg.xml.FromUserName[0],
        fromUser:msg.xml.ToUserName[0],
        type:'text',
        time:Date.now(),
        content:feedback
    });

}
////