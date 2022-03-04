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
    
    //접속한 클라이언트의 정보가 수신되면 실행
    socket.on('login', function(data) {
        console.log('client logged-in:\n name: '+ data.name);

        socket.name = data.name;
        io.emit('login', data.name);
    })
        
    socket.on('SEND', function(msg){
        socketList.forEach(function(item, i){
            console.log(item.id)
            let data = {
                from: {
                    name: socket.name
                },
                msg: msg
            }
            if(item != socket){
                item.emit('SEND', data);
            }
        })
        // console.log(socketList.length);
    })
    socket.on('disconnect', function(){
        io.emit('goodbye', socket.name);
        socketList.splice(socketList.indexOf(socket), 1);
    })
})