const socket = io('/');

//Creating a video grid 
const videoGrid = document.getElementById('video-grid');

const myVideo=document.createElement('video');
//Muting my own video as I don't want to hear my own voice
myVideo.muted = true;

let myVideoStream
//var peer = new Peer();
var peer =new Peer(undefined, {
    path:'/peerjs',
    host: '/',
    port: '443'
});
const peers={}

// To access user media i.e. the camera and microphone
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream =stream;
    addVideoStream(myVideo, stream);

    // To Answer Video Call
    peer.on('call', call =>{
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream =>{
            addVideoStream(video, userVideoStream)
        })
    })


    socket.on('user-connected', (userId) =>{
        connectToNewUser(userId, stream);
    })

    //function to chat
    let msg = $('input');

    $('html').keydown((e) => {
    //Enter has key 13
        if (e.which ==13 && msg.val().length !==0)
        {
            console.log(msg.val());
            socket.emit('messsage', msg.val());
            msg.val("");
        }
    });

    socket.on('createMessage', (message) => {
        console.log("created message" + message);
        $('.messages').append(`<li class="message"><b>user</b></br>${message}</li>`);
        scrollToBottom();
    })

});

socket.on('user-disconnected' ,userId => {
    if (peers[userId]) peers[userId].close()
})

peer.on('open', id =>{
    socket.emit('join-room', ROOM_ID, id);
})




//function to add stream of new user
const connectToNewUser = (userId, stream) =>{
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream =>{
        addVideoStream(video, userVideoStream)
    })

    call.on('close', () =>{
        video.remove()
    })
    peers[userId]=call
}

//function to add video stream to grid
const addVideoStream = (video, stream) => {
    video.srcObject =stream;
    video.addEventListener('loadedmetadata', () =>{
        video.play();
    })
    //Appending video to the grid
    videoGrid.append(video); 
}

const scrollToBottom = () => {
    let d =$('.main_chat_window');
    d.scrollTop(d.prop("scrolHeight"));
}

//mute button
const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    }
    else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton = () =>{
    const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
    `
    document.querySelector('.main_mute_button').innerHTML =html;
}

const setUnmuteButton = () => {
    const html =`
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
    `
    document.querySelector('.main_mute_button').innerHTML =html;
}

const playStop =() =>{
    console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo();
    }
    else{
        setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

const setPlayVideo = () =>{
    const html = `
    <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
    `
    document.querySelector('.main_video_button').innerHTML =html;
}

const setStopVideo = () =>{
    const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
    `
    document.querySelector('.main_video_button').innerHTML =html;
}

//chat window toggle hide/unhide
function openNav() {
    document.getElementById("mySidenav").style.width = "320px";
  }
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

//SCREEN SHARE CODE
  'use strict';

  // Polyfill in Firefox.
  // See https://blog.mozilla.org/webrtc/getdisplaymedia-now-available-in-adapter-js/
  if (adapter.browserDetails.browser == 'chrome') {
    adapter.browserShim.shimGetDisplayMedia(window, 'screen');
  }
  
  function handleSuccess(stream) {
    startButton.disabled = true;
    const video = document.querySelector('video');
    video.srcObject = stream;
  
    // demonstrates how to detect that the user has stopped
    // sharing the screen via the browser UI.
    stream.getVideoTracks()[0].addEventListener('ended', () => {
      errorMsg('The user has ended sharing the screen');
      startButton.disabled = false;
    });
  }
  
  function handleError(error) {
    errorMsg(`getDisplayMedia error: ${error.name}`, error);
  }
  
  function errorMsg(msg, error) {
    const errorElement = document.querySelector('#errorMsg');
    errorElement.innerHTML += `<p>${msg}</p>`;
    if (typeof error !== 'undefined') {
      console.error(error);
    }
  }
  
  const startButton = document.getElementById('startButton');
  startButton.addEventListener('click', () => {
    navigator.mediaDevices.getDisplayMedia({video: true})
        .then(handleSuccess, handleError);
  });
  
  if ((navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices)) {
    startButton.disabled = false;
  } else {
    errorMsg('getDisplayMedia is not supported');
  }


//TEXT CHAT 
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

const name = prompt('What is your name?')
appendMessage('You joined')
socket.emit('new-user', name)

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', name => {
  appendMessage(`${name} connected`)
})

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value
  appendMessage(`You: ${message}`)
  socket.emit('send-chat-message', message)
  messageInput.value = ''
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}

