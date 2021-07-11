const socket = io('/');
const videoGrid = document.getElementById('video-grid');    //Creating a video grid 
const myVideo=document.createElement('video');

myVideo.muted = true;  //Muting my own video as I don't want to hear my own voice

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

});

//To remove video of Disconnected users and intimate in the chat
socket.on('user-disconnected' ,(userId, person) => {
    if (peers[userId]) peers[userId].close()
    appendMessage(`${person} left`)
})

peer.on('open', id =>{
    socket.emit('join-room', ROOM_ID, id);
})


//Function to add stream of new user
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
    videoGrid.append(video);  //Appending video to the grid
}

const scrollToBottom = () => {
    let d =$('.main_chat_window');
    d.scrollTop(d.prop("scrolHeight"));
}

//******************AUDIO MUTE FUNCTIONALITY******************
//Function to mute/unmute audio
const muteUnmuteAudio = () => {
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

//change mute icon state 
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


//******************VIDEO TOGGLE FUNCTIONALITY******************
//Function to toggle Video
const playStopVideo =() =>{
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

//change video icon state
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


//******************SCREEN SHARE Functionality***************************
  'use strict';

  if (adapter.browserDetails.browser == 'chrome') {
    adapter.browserShim.shimGetDisplayMedia(window, 'screen');
  }
  
  function handleSuccess(stream) {
    startButton.disabled = true;
    const video = document.querySelector('video');
    video.srcObject = stream;
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
  
  //Function hit on Pressing Start Screen share button
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
  

//******************TEXT CHAT FUNCTIONALITY******************
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

const new_name = prompt('What is your name?')
appendMessage('You joined')
socket.emit('new-user', new_name)

//Transmitting messages by users in chat window
socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-chatconnected', new_name => {
  appendMessage(`${new_name} joined the Room`)
})

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value
  appendMessage(`You: ${message}`)
  socket.emit('send-chat-message', message)
  messageInput.value = ''
})

//Append chat function
function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}



//******************INVITE BUTTON FUNCTIONALITY******************

const inviteButton = document.getElementById('copy_url');
inviteButton.addEventListener("click", (e) => {
  navigator.clipboard.writeText(window.location.href);
  alert("Invite link copied to clipboard!");
});


//******************RAISE HAND BUTTON FUNCTIONALITY******************

const raiseHand = document.getElementById('raiseHand');
raiseHand.addEventListener("click", (e) => {
  //emit through socket when button is clicked
  appendMessage(`You: ✋`)
  socket.emit('send-chat-message', `✋`)
  alert(`${new_name}`+" raised hand: ✋")
});


//******************LEAVE MEET BUTTON FUNCTIONALITY******************

function close_window() {
  if (confirm("Close Window?")) {
    close();
  }
}
