var express = require('express');
var cookieParser = require('cookie-parser');

var app = express();
app.use(cookieParser());

app.get('/read',function(req,res,next){
	res.json(req.cookies); //读取在request中的cookie值，在express框架下cookie值都存在于cookies属性中
});
app.get('/abc',function(req,res,next){
	res.json(req.cookies);
})

app.get('/write',function(req,res,next){
	res.cookie('my_cookie','hello',{domain: 'www.abc.com',path:'/abc'});//作用是设置一个my_cookie:hello的cookie项，
	                                                       //domain确定了必须在此域名下才可返回所要定义的新的cookie值，
	                                                       //相当于加了一个if条件
	res.json(req.cookies);
});

app.listen(3000);
console.log("Server running at port: 3000");