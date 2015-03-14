var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var UserControllers = require('./controllers/user');


app.use(bodyParser({"Content-Type":"application/x-www-form-urlencoded" }));
app.use(cookieParser());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

app.use(express.static(__dirname+'/static'));
app.use(function(req,res){
    res.sendFile(path.join(__dirname, './static', 'index.html'));
});

//the interface of login validate
app.get('/api/validate',function(req,res){
    _userId = req.session._userId;
    if(_userId){
        UserControllers.User.findUserById(_userId,function(err,callback){
            if(err){
                res.json(401,{msg : err});
            }else{
                res.json(user);
            }
        })
    }else{
        res.json(401,null);
    }
});
app.post('/api/login',function(req,res){
    email = req.body.email;
    if(email){
        UserControllers.User.findByEmailOrCreate(email,function(err,user){
            if(err){
                res.json(500,{msg : err});
            }else{
                req.session._userId = user._id;
                res.json(user);
            }
        })
    }else{
        res.json(401);
    }
});
//logout validate
app.get('/api/logout',function(req,res){
    req.session._userId = null;
    res.json(401);
});




var io = require('socket.io').listen(app.listen(port));
var messages = [];

io.sockets.on('connection',function(socket){
    socket.on('getAllMessages',function(){
        socket.emit('allMessages',messages);
    });
    socket.on('createMessage',function(message){
        messages.push(message);
        io.sockets.emit('messageAdded',message);

        console.log("message is " + message);
    });
});
console.log('chat is on port ' + port +'!');
