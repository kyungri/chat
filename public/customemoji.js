//const { socket } = require("socket.io");
let chat = document.getElementById('chat');
let chatView = document.getElementById('msg');
let chatForm = document.getElementById('chatform');

socket.emit('login', {
    name: makeRandomName()
})

socket.on('login', function(data){
    let join = $('<p id="joinuser"></p>');
    join.append("<p>"+data + "님이 입장했습니다.</p>");
    
    $('#msg').append(join);
})

socket.on('goodbye', function(data){
    let disconnect = $('<p id="joinuser"></p>');
    disconnect.append("<p>"+data + "님이 나가셨습니다.</p>");
    
    $('#msg').append(disconnect);
})

function makeRandomName(){
    let name = "";
    let possible = "abcdefghijklmnopqrstuvwxyz";
    for(let i=0; i<3; i++){
        name += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return name;
}

//오늘날짜
function show_date(){
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth()+1;
    const date = today.getDate();
    const time = today.getHours()+":"+today.getMinutes();
    $("#spandate").html(year+"."+month+"."+date+""+time);
    return year+"."+month+"."+date+" "+time;
}

//글자 수 제한경고창
function showNotification(str){
    const notification = document.getElementById('notification-container');
    $('#notification-container > p').text(str);
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 1000);
}

//메세지 송신
chatForm.addEventListener('submit', function(){
    var msgText = $('#input_box');
    
    if(msgText.val() == ''){
        return;
    } else {
        socket.emit('SEND', msgText.val());
        let today = show_date();
        
        let msgLine = $('<div class="msgLine">');
        let msgBox = $('<div class="me">');
        let date = $('<p id="date"></p>')
        
        msgBox.append(msgText.val());
        msgBox.css('display', 'inline-block');
        msgLine.css('text-align', 'right');
        msgLine.append(msgBox);
        date.append(today);
        msgLine.append(date);
        
        // if($('#msg').children('.msgLine').children('p') != 0){
        //     console.log($('#msg').children('.msgLine').last().children('p').text());
        //     if($('#msg').children('.msgLine').last().children('p').text() == today){
        //         $('#msg').not(this.lastChild).children('.msgLine').children('p').remove();
        //         date.append(today);
        //         msgLine.append(date);
        //     }else{
        //         date.append(today);
        //         msgLine.append(date);
        //     }
        // }
        
        $('#msg').append(msgLine);
        msgText.val('');
        chatView.scrollTop = chatView.scrollHeight;
    }
    //console.log($('#msg').children('.msgLine').children('p').text());
})
//메세지 수신
socket.on('SEND', function(data){
    let username = data.from.name;
    let msgLine = $('<div class="msgLine">')
    let msgBox = $('<div class="msgBox">')
    let date = $('<p id="date"></p>')
    let name = $('<p id="username"></p>')
    let today = show_date();
    
    msgBox.append(data.msg);
    msgBox.css('display', 'inline-block');
    date.append(today);
    name.append(username)
    msgLine.append(name)
    msgLine.append(msgBox);
    msgLine.append(date)
    $('#msg').append(msgLine);

    chatView.scrollTop = chatView.scrollHeight;
})