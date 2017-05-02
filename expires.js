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
	res.cookie('my_cookie','hello',{
		      maxAge:2*60*1000  //以当前时间为基准，使cookie的有效期为2分钟
	});

	res.json(req.cookies);
});

app.listen(3000);
console.log("Server running at port: 3000");