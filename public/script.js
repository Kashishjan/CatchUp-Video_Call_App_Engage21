const socket = io('/');

//Creating a video grid 
const videoGrid = document.getElementById('video-grid');

const myVideo=document.createElement('video');
//Muting my own video as I don't want to hear my own voice
myVideo.muted = true;

let myVideoStream
var peer =new Peer(undefined, {
    path:'/peerjs',
    host: '/',
    port: '443'
});

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

$('html').keydown(function (e) {
    //Enter has key 13
    if (e.which ==13 && msg.val().length !==0)
    {
        console.log(msg.val());
        socket.emit('messsage', msg.val());
        msg.val('');
    }
});

socket.on("createMessage", (message) => {
    console.log("created message", message);
    $('ul').append(`<li class="message"><b>user</b></br>${message}</li>`);
    scrollToBottom();
})

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


