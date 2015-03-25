var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var path = require('path');

//express 3.x remove some plugin,so you must add the plugin manual
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

var UserControllers = require('./controllers/user');

//add socket.io authentication
/*var parseSignedCookie = require('connect').cookieParser;*/
var MongoStore = require('connect-mongo')(expressSession);
var Cookie = require('Cookie');
var sessionStore = new MongoStore({
    url : 'mongodb://localhost/technode'
});
app.use(expressSession({
    secret: 'technode',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge : 60 * 1000 * 60 },
    store : sessionStore
}));


/*app.use(bodyParser({"Content-Type":"json/urlencoded" }));*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

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

//add socket.io authentication
io.set('authorization',function(handshakeData,accept){
    handshakeData.cookie = Cookie.parse(handshakeData.headers.cookie);
    var connectSid = handshakeData.cookie['connect.sid'];
/*    connectSid = parseSignedCookie(connectSid,'technode');*/
    connectSid = cookieParser.signedCookie(connectSid,'technode');
    if(connectSid){
        sessionStore.get(connectSid,function(error,session){
            if(error){
                accept(error.message,false);
            }else{
                handshakeData.session = session;
                if(session._userId){
                    accept(null,true);
                }else{
                    accept('No Login');
                }
            }
        })
    }else{
        accept('No Session');
    }
});


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
