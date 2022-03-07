const express = require('express');
const app = express();
app.set('port', process.env.PORT || 4000);

const socket = require('socket.io');
const http = require('http');
const { userInfo } = require('os');
const server = http.createServer(app);
const io = socket(server);

//다대다 채팅일때 list 안에 소켓구분으로 사용자를 판별
let socketList = [];

app.use(express.static(__dirname + '/public'));

server.listen(4000, function(){
    console.log('4000 server on!')
})
let roomOne = [];
let roomTwo = [];
//클라이언트가 socket.io서버에 접속시 connection 이벤트 발생
io.on('connection', function(socket){
    socketList.push(socket);
    console.log(socketList.length)
    console.log('user join')
    //접속한 클라이언트의 정보가 수신되면 실행
    socket.on('login', function(data) {
        console.log('client logged-in:\n name: '+ data.name);
        socket.name = data.name;
        let roomId = 'room1';
        socket.join(roomId);
        roomOne.push('1');
        io.emit('login', data.name);
    })
    
    socket.on('join room', function(data){
        let id = socket.name;
        let prevRoomId = data.nowroomId;
        let nextRoomId = data.roomId;
        
        console.log("여기오면 안돼 ")
        socket.leave('room'+prevRoomId);
        io.sockets.in('room'+prevRoomId).emit('goodbye', id);
        if(prevRoomId == 1){
            roomOne.pop();
        }else{
            roomTwo.pop();
        }
        if(roomTwo.length>=3){
            let message = '1:1 대화방은 정원초과입니다.';
            io.emit('error', message);
            socket.join('room1');
            io.sockets.in('room1').emit('login', id);
            roomOne.push('1');
        }else{
            socket.join('room'+nextRoomId);
            io.sockets.in('room'+nextRoomId).emit('login', id);
            if(nextRoomId == 1){
                roomOne.push('1');
            }else{
                roomTwo.push('1');
            }
        }
        console.log("1:"+roomOne.length)
        console.log("2:"+roomTwo.length)
    })

    socket.on('SEND', function(data){
        console.log("sendroomid: "+data.roomId)
        // socketList.forEach(function(item, i){
        //     // console.log("length"+item.length)
        //     // let data = {
        //     //     from: {
        //     //         name: socket.name
        //     //     },
        //     //     msg: data.msg
        //     // }
        //     // if(item != socket){
        //     //     //자신을 제외한 다른 모두에게 메세지 전송
        //     //     // item.emit('SEND', data);
        //     //     console.log(data.roomId);
        //     //     socket.broadcast.to(roomId).emit('SEND', data);
        //     // }
        // })
        
        io.sockets.in('room' + data.roomId).emit('new message', {
            name: socket.name,
            msg: data.msg
        })
        console.log("length "+socketList.length);
    })
    socket.on('disconnect', function(){
        io.emit('goodbye', socket.name);
        socketList.splice(socketList.indexOf(socket), 1);
    })
})