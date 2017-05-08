//加载依赖库
var express = require ('express');
var path = require('path');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var session = require('express-session');
var checkLogin = require('./checkLogin.js');
var moment = require('moment');


var Waterline=require('waterline');
var mysqlAdapter=require('sails-mysql');
var mongoAdapter=require('sails-mongo');

var adapters={
	mongo:mongoAdapter,
	mysql:mysqlAdapter,
	default:'mysql'
};

var connections={
	mongo:{
		adapter:'mongo',
		url:'mongodb://localhost/waterline_sample'
	},
	mysql:{
		adapter:'mysql',
		url:'mysql://root:9211@localhost/waterlinesample'
	}
};
 
var User=Waterline.Collection.extend({
	identity:'user',
	connection:'mysql',
	migrate:'safe',
	schema:true,
	attributes:{
		username:{
			type:'string',
			required:true
		},
		password:{
			type:'string',
			required:true
		},
		email:'string',
		createTime:new Date()
		
	}
});

var Note=Waterline.Collection.extend({
	identity:'note',
	connection:'mysql',
	migrate:'safe',
	attributes:{
		title:{
			type:'string',
			required:true
		},
		author:{
			type:'string',
			required:true
		},
		tag:{
			type:'string',
			required:true
		},
		content:{
			type:'string',
			required:true
		},
		createTime:new Date(),
		
	}		
});

var orm=new Waterline();

orm.loadCollection(User);
orm.loadCollection(Note);

var config={
	adapters:adapters,
	connections:connections
};

//引入mongoose
var mongoose = require('mongoose');
//引入模型
var models = require('./models/models');


//使用mongoose链接服务
//mongoose.connect('mongodb://localhost:27017/notes');
//mongoose.connection.on('error',console.error.bind(console,'链接数据库失败'));



//创建express实例
var app = express();

//定义EJS模板引擎和模板文件位置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//定义静态文件目录
app.use(express.static(path.join(__dirname,'public')));

//定义数据解析器
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//建立session模型
app.use(session({
	secret: '1234',
	name: 'note',
	cookie: {maxAge: 1000 * 60 * 10080}, //设置session的保存时间为一周
	resave: false,
	saveUninitialized: true
}));




var User = models.User;
var Note = models.Note;

//响应首页get请求
app.get('/', checkLogin.noLogin);
app.get('/',function(req, res){
	Note.find({author: req.session.user.username})
		.exec(function(err,allNotes){
			if(err){
				console.log(err);
				return res.redirect('/');
			}
			res.render('index',{
				title:'首页',
				user:req.session.user,
				notes:allNotes
				//success:req.flash('success');
			});
		});
});


//检验用户输入信息合法与否
var wrong = '';

//响应注册页面get请求
app.get('/register',function(req, res){
	console.log('注册！');
	//已经注册成功的用户，只能跳转回主页
	if(req.session.user){
		return res.redirect('/');
	}

	res.render('register',{
		user: req.session.user,
		title: '注册',
		error: wrong, //在app.get的res.render函数中传递该变量
	});
	});
//post请求
app.post('/register', function(req,res){
	//req.body 可以获取表单每项数据
	var username = req.body.username,
		password = req.body.password,
		passwordRepeat = req.body.passwordRepeat;

		
	var validatename=/^\w{3,20}$/;	
	//验证用户名
	//其中\w指表示匹配字母、数字、下划线的组合; $表示一直匹配到末尾
	//	^ :字符串的开始  $:字符串的结束. 
	//	If you left off the ^, for example, ~@*##@horatio would pass your validation.
	//	 Likewise for the $ and the end of the string being checked. –
	
	//验证密码
	//密码：长度不能少于6，必须同时包含数字、小写字母、大写字母。
	var validatepw=/^(?=.{6,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$/;
 


	

		//检查输入的用户名是否为空，使用trim去掉两端空格
	if (username.trim().length == 0) {
		console.log('用户名不能为空！');
		return res.redirect('/register');
	}	 else if (!(validatename.test(username.trim()))) {
        console.log("用户名只能包含大小写字母与数字，且为3-20个字符！");
        return res.redirect('/register');
    } else if (!(validatepw.test(password.trim()))) {
     	console.log("密码必须包含大小写字母与数字，且长度不能少于6位！");
        return res.redirect('/register');

	
    } else if(password.trim().length == 0 || passwordRepeat.trim().length == 0) {
    	////检查输入的密码是否为空，使用trim去掉两端空格
		req.flash('err',"请再输入一次确认密码！");
		console.log('/register');
	} else if(password!=passwordRepeat) {
	//检查两次输入的密码是否一致
		console.log("两次输入的密码不一致！");
		return res.redirect('/register');
	}

	

	//检查用户名是否已经存在，如果不存在，保存该条记录
	User.findOne({username:username}, function(err,user){
		if(err){
			console.log(err);
			return res.redirect('/register');
		}
		if (user) {
			console.log('用户名已经存在');
			wrong = '用户名已经存在';//在app.post中对全局变量赋值
			return res.redirect('/register');
		}
	
	//对密码进行md5加密
	var md5 = crypto.createHash('md5'),
		md5password = md5.update(password).digest('hex');

	//新建user对象用于保存数据
	var newUser = new User({
		username: username,
		password: md5password
	});

	newUser.save(function(err,doc){
		if(err){
			console.log(err);
			return res.redirect('/register');
		}
		
		//console.log('注册成功');
		return res.redirect('/');
	});
});
})




app.get('/login',function(req, res){
	console.log('登陆！');
	//已经登录成功的用户，只能跳转回主页
	if(req.session.user){
		return res.redirect('/');
	}

	res.render('login',{
		user: req.session.user,
		title: '登陆'
/*		user:req.user.username */
	});
	});


app.post('/login',function(req,res){
	var username = req.body.username,
		password = req.body.password;

	User.findOne({username:username},function (err,user){
		if(err){
			console.log(err);
			return res.redirect('/login');
		}
		if (!user) {
			console.log('用户不存在！');
			return res.redirect('/login');
		}
	//对密码进行md5加密
	var md5 = crypto.createHash('md5');
			md5password = md5.update(password).digest('hex');
	if(user.password != md5password){
		console.log('密码错误！');
		return res.redirect('/login');
	}
	console.log('登陆成功!');
	user.password = null;
	// delete user.password;
	req.session.user = user;
	return res.redirect('/');
	});	
});






app.get('/quit',function(req, res){
	req.session.user=null;
	console.log('退出！');
	return res.redirect('/login');
	});

app.get('/post',function(req, res){
	console.log('发布！');
	res.render('post',{
		user: req.session.user,
		title:'发布'
	});
	});

app.post('/post',function(req,res){
	var note = new Note({
		title: req.body.title,
		author: req.session.user.username,
		tag: req.body.tag,
		content: req.body.content
	});

	note.save(function(err,doc){
		if(err){
			console.log(err);
			return res.redirect('/post');
		}
		console.log('文章发表成功！')
		return res.redirect('/');
	});
});

app.get('/detail/:_id',function(req,res){
	console.log('查看笔记！');
	Note.findOne({_id:req.params._id})
		.exec(function(err,art){
			if(err){
				console.log(err);
				return res.redirect('/');
			}
			if(art){
				res.render('detail',{
					title:'笔记详情',
					user:req.session.user,
					art: art,
					moment:moment
				});
			}
		});
});

//监听3000端口
orm.initialize(config,function(err,models){
	if(err){
		console.error('orm initialize failed.',err);
		return;
	}
	app.models=models.collections;
	app.connections=models.connections;

	app.listen(3000);
	console.log('app is running at port 3000');
});