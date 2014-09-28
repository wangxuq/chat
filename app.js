var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

app.use(express.static(__dirname+'/static'));

app.use(function(req,res){
    res.sendFile('./static.index.html');
});

var io = require('socket.io').listen(app.listen(port));
var messages = [];

io.sockets.on('connection',function(socket){
    socket.on('getAllmessages',function(){
        socket.emit('allmessages',messages);
    });
    socket.on('createMessage',function(message){
        messages.push(message);
        io.sockets.emit('messageAdded',message);
    });
});


console.log('chat is on port' + port +'!');
