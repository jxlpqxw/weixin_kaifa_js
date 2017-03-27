var later = require('later');
var https = require('https');

var appid = "wxeb7e7275df7329a2";
var appsecret = "ad8668e7c8e095cc83c0d1fccd3f4452";
var access_token;

later.date.localTime();
console.log("Now:" + new Date());

var sched = later.parse.recur().every(1).hour();
next = later.schedule(sched).next(10);
console.log(next);

var timer = later.setInterval(test, sched);
setTimeout(test, 2000);

function test() {
    console.log(new Date());
    var options = {
        hostname: 'api.weixin.qq.com',
        path: '/cgi-bin/token?grant_type=client_credential&appid=' + appid + '&secret=' + appsecret
    };
    var req = https.get(options, function (res) {
        var bodyChunks = '';
        res.on('data', function (chunk) {//在发生事件data时将字符串进行拼接
            bodyChunks += chunk;
        });
        res.on('end', function () {   //在发生事件end时可以对chunk进行解析
            var body = JSON.parse(bodyChunks);
            if (body.access_token) {
                access_token = body.access_token;
                console.log(access_token);
            } else {
                console.dir(body);
            }
        });
    });
    req.on('error', function (e) {
        console.log('ERROR: ' + e.message);
    });
}