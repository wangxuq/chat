angular.module('techNodeApp',[]);

//package the socket service
angular.module('techNodeApp').factory('socket',function($rootScope){
    var socket = io.connect('/');
    return {
        on : function(eventName,callback){
            socket.on(eventName,function(){
                var args = arguments;
                $rootScope.$apply(function(){
                    callback.apply(socket,args);
                });
            });
        },
        emit : function(eventName,data,callback){
            socket.emit(eventName,data,function(){
                var args= arguments;
                $rootScope.$apply(function(){
                    if(callback){
                        callback.apply(socket,args);
                    }
                });
            });
        }
    }
});

//define RoomCtrl
angular.module('techNodeApp').controller('RoomCtrl',function($scope,socket){
    $scope.messages = [];
    socket.emit('getAllMessages');
    socket.on('allMessages',function(messages){
        $scope.messages = messages;
    });
    socket.on('messageAdded',function(message){
        $scope.messages.push(message);
    });
})

//define MessageCreatorCtrl
angular.module('techNodeApp').controller('MessageCreatorCtrl',function($scope,socket){
    $scope.newMessage ='';
    $scope.createMessage = function(){
        if($scope.newMessage == ''){
            return ;
        }
        socket.emit('createMessage',$scope.newMessage);
        $scope.newMessage = '';
    }
});
