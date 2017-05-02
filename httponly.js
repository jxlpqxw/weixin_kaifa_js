var express = require('express');
var cookieParser = require('cookie-parser');

var app = express();
app.use(cookieParser('saddsafwerqsdaf'));//cookieParser里的参数可选，如果加上这个字符串参数则用于签名cookie，

app.get('/read',function(req,res,next){
	res.json(req.cookies); //读取在request中的cookie值，在express框架下cookie值都存在于cookies属性中
});
app.get('/abc',function(req,res,next){
	res.json(req.cookies);
})

app.get('/write',function(req,res,next){
	res.cookie('a','123');
	res.cookie('b','456',{httpOnly:true,signed:true});
	res.json(req.signedCookies);


	res.json(req.cookies);
});

app.listen(3000);
console.log("Server running at port: 3000");