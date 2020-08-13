const socket = io();

const chatForm = document.getElementById('chat-form');

socket.emit('userConnect', document.querySelector('div span').innerHTML);

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //get message text
    const message = e.target.elements[0].value;

    //clear form input box
    e.target.elements[0].value = '';

    //emit chat message
    socket.emit('chatMessage', message);
})

socket.on('appendChatMessage', msg => {
    appendChatMessage(msg, 'msg')

});

socket.on('selfMessage', msg => {
    appendChatMessage(msg, 'self-msg')
})


function addMember(member){
    if (member != null){
        //create element
        const newMember = document.createElement('h3');

        //set name of class
        newMember.className = 'member';

        //set a 'name' attribute
        newMember.setAttribute('name', member);

        //fill in text, append as child of parent class
        const name = document.createTextNode(member);
        newMember.appendChild(name);

        //append parent class to .body
        document.getElementsByClassName('drop-content')[0].appendChild(newMember);
    }
}


// MESSAGE FORMAT HTML
/* 
    <div class='chat-message'>
        <p class='msg'>
            <div class='header-info'>
                <div class='sender'>Sender</div>
                <div class='txt'>Text</div>
            </div>

            <div class-'time'>Time</div>
        </p>
    </div>
*/
function appendChatMessage(msg, msgClass){

    const chatMsg = document.createElement('div');
    chatMsg.className = 'chat-message-wrapper';

    const message = document.createElement('p');
    message.className = msgClass;

    const headerInfo = document.createElement('div');
    headerInfo.className = 'header-info';
    headerInfo.setAttribute('name', msg.sender);
    
    // const timeDiv = document.createElement('h4');
    // timeDiv.className = 'time';
    // const time = document.createTextNode(msg.time);
    // timeDiv.appendChild(time);

    const txtDiv = document.createElement('div');
    txtDiv.className = 'txt';
    const txt = document.createTextNode(msg.txt);
    txtDiv.appendChild(txt);

    if (msgClass === 'msg') {
        const senderDiv = document.createElement('h4');
        senderDiv.className = 'sender';
        const sender = document.createTextNode(msg.sender);


        const chatHistory = document.getElementById('chat-history');

        //to determine if to show sender
        const lastElementIndex = chatHistory.childElementCount;

        if (lastElementIndex > 0) {
            const lastClass = chatHistory.childNodes[lastElementIndex].childNodes[0];

            //if element above is of class 'msg'
            if (lastClass.className === 'msg'){
                const lastClassName = lastClass.childNodes[0].getAttribute('name');
                
                //and if last class's name attribute
                //does not equal to current message's sender
                if (lastClassName != msg.sender){
                    senderDiv.appendChild(sender);
                    headerInfo.appendChild(senderDiv);
                    message.appendChild(headerInfo);
                }
            }
            else{
                senderDiv.appendChild(sender);
                headerInfo.appendChild(senderDiv);
                message.appendChild(headerInfo);
            }
        }
        else {
            senderDiv.appendChild(sender);
            headerInfo.appendChild(senderDiv);
            message.appendChild(headerInfo);
        }
        
    }

    //headerInfo.appendChild(timeDiv);
    message.appendChild(txtDiv);
    

    chatMsg.appendChild(message);

    document.getElementById('chat-history').appendChild(chatMsg);

    window.scrollTo(0, document.body.scrollHeight);

    return message;

}


function broadcastMessage(msg){
    const chatHist = document.createElement('div');
    chatHist.className = 'broadcast-message';
    const txt = document.createTextNode(msg);
    chatHist.appendChild(txt);
    document.getElementById('chat-history').appendChild(chatHist);
}