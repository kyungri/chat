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

io.on('connection', function(socket){
    socketList.push(socket);
    console.log(socketList.length)
    console.log('user join')
    let roomId;
    //접속한 클라이언트의 정보가 수신되면 실행
    socket.on('login', function(data) {
        console.log('client logged-in:\n name: '+ data.name);
        socket.name = data.name;
        roomId = 'room1';
        socket.join(roomId);
        io.emit('login', data.name);
    })
    
    socket.on('join room', function(data){
        let id = socket.name;
        let prevRoomId = data.nowroomId;
        let nextRoomId = data.roomId;

        console.log("-------------------")
        console.log("p: "+prevRoomId)
        console.log("n: "+nextRoomId)
        console.log("-------------------")

        socket.leave('room'+prevRoomId);
        socket.join('room'+nextRoomId);
    })

    socket.on('SEND', function(data){
        console.log(data.roomId)
        io.sockets.in('room' + data.roomId).emit('new message', {
            // socketList.forEach(function(item, i){
            //     console.log(item.id)
            //     let data = {
            //         from: {
            //             name: socket.name
            //         },
            //         msg: data.msg
            //     }
            //     if(item != socket){
            //         //자신을 제외한 다른 모두에게 메세지 전송
            //         // item.emit('SEND', data);
            //         console.log(data.roomId);
            //         socket.broadcast.to(roomId).emit('SEND', data);
            //     }
            // })
            name: socket.name,
            msg: data.msg
        })
        // console.log(socketList.length);
    })
    socket.on('disconnect', function(){
        io.emit('goodbye', socket.name);
        socketList.splice(socketList.indexOf(socket), 1);
    })
})