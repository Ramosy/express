// 使用express框架
var express = require('express');
// 使用nodejs的路径系统模块
var path = require('path');
// 网站图标【书签图标】
var favicon = require('serve-favicon');
// 日志,参考http://www.cnblogs.com/chyingp/p/node-learning-guide-express-morgan.html博客
var logger = require('morgan');
// 使用nodejs的文件系统模块
var fs = require('fs');
// 使用cookie模块,参考https://segmentfault.com/a/1190000004139342?_ea=504710博客
var cookieParser = require('cookie-parser');
// HTTP请求体解析中间件,参考http://blog.csdn.net/yanyang1116/article/details/54847560博客
var bodyParser = require('body-parser');
// 配置文件
var config = require('./bin/config');
// 不同的子路由，对应不同的二级根
var index = require('./routes/index');
var users = require('./routes/users');
// 生成日志文件
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});
// 启动express服务
var app = express();

// view engine setup[使用jade模板引擎]
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//环境设置
//代码:app.set('env', 'production/development/test');
//window命令行：#node中常用的到的环境变量是NODE_ENV，首先查看是否存在
//set NODE_ENV
//#如果不存在则添加环境变量
//set NODE_ENV=production
//linux#node中常用的到的环境变量是NODE_ENV，首先查看是否存在
//echo $NODE_ENV
//#如果不存在则添加环境变量
//export NODE_ENV=production
//#环境变量追加值
//export path=$path:/home/download:/usr/local/
//#某些时候需要删除环境变量
//unset NODE_ENV
//#某些时候需要显示所有的环境变量
//env
app.set('env', config.currentENV);
// 使用第三方中间件serve-favicon设置网站图标
app.use(favicon(path.join(__dirname, 'public', '/favicon/ramosy.ico')));
// 使用第三方中间件morgan设置日志
if(app.get('env') == 'development'){
    app.use(logger('tiny'));
    app.use(logger('common', {stream: accessLogStream}));
}else {
// setup the logger
    app.use(logger('short'));
    app.use(logger('common', {stream: accessLogStream}));
}

//使用第三方中间件body-parser解析请求体
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//使用第三方中间件cookie-parser解析cookie
app.use(cookieParser());
//设置静态资源路径
app.use(express.static(path.join(__dirname, 'public')));
//一级路由设置[路由前缀]
app.use('/', index);
app.use('/users', users);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
