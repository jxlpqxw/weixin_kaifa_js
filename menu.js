
var https = require('https');
var access_token='ARCm-xcwXCSGVhpqT5o9GQwQjq1l3fTl04mXfEhB1CLb0mmKmwijNfMV74zAPPRraSWqmlsmPP3LLsucd_TpaEN3p-q9OnEalhWyhaIswBoJUqwjfvmvkSqcrVVJLiTuNHPdABAQKS';
var menu = {
    "button": [
        {
            "name": "我的账号",
            "sub_button": [
                {
                    "type": "click",
                    "name": "我的帐户",
                    "key": "V1001_MY_ACCOUNT"
                },
                {
                    "type": "click",
                    "name": "已投项目",
                    "key": "V1002_BID_PROJECTS"
                },
                {
                    "type": "click",
                    "name": "回款计划",
                    "key": "V1003_RETURN_PLAN"
                },
                {
                    "type": "click",
                    "name": "交易明细",
                    "key": "V1004_TRANS_DETAIL"
                },
                {
                    "type": "click",
                    "name": "注册/绑定",
                    "key": "V1005_REGISTER_BIND"
                }
            ]
        },
        {
            "type": "view",
            "name": "马上投资",
            "url": "http://adviser.ss.pku.edu.cn/wx/"
        },
        {
            "name": "送钱活动",
            "sub_button": [
                {
                    "type": "view",
                    "name": "注册送红包",
                    "url": "http://adviser.ss.pku.edu.cn/wx/bszn/"
                },
                {
                    "type": "click",
                    "name": "邀请好友一起赚钱",
                    "key": "V1001_GOOD"
                },
                {
                    "type": "view",
                    "name": "加入我们",
                    "url": "http://www.ss.pku.edu.cn/"
                }
            ]
        }
    ]
};

var post_str = new Buffer(JSON.stringify(menu));
console.log(post_str.toString());
console.log(post_str.length);

var post_options = {
    host: 'api.weixin.qq.com',
    port: '443',
    path: '/cgi-bin/menu/create?access_token=' + access_token,
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': post_str.length
    }
};

var post_req = https.request(post_options, function (response) {
    //第一个参数必须是String或object类型，如果是String的话默认
    //按照url.parse()方法解析,或者必须是一个url，第二个参数是一个回调函数
    // 即对微信服务器发回本服务器的response添加监听器，以对相应的
    //response内容作出反应
    var responseText = [];
    var size = 0;
    response.setEncoding('utf8');
    response.on('data', function (data) {
        responseText.push(data);
        size += data.length;
    });
    response.on('end', function () {
        console.log(responseText);
    });
});
post_req.write(post_str);//把body中的内容写到request里
post_req.end();