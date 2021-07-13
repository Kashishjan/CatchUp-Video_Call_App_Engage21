# CatchUp - Video_Call_App
CatchUp is an online video calling app that allows mutiple users to connect and have a meet online. This project was developed as a part of the Microsoft Engage Mentorship Program 2021. 

Tech stack : It utilizes the power of WebRTC that provides web browsers and mobile applications with real-time communication via simple application programming interfaces. The other tech stack used includes Socket.io, PeerJS Library, UUID and Express server. The web development tools used are JavaScript, NodeJS, EJS, HTML and CSS.

# Features of CatchUp
This application supports features like:
1. Login Page for User Information
2. Multiple Rooms can be made
3. Each room can comfortably allow upto 4 Participants
4. Text Chat
5. Audio Mute/Unmute
6. Video Toggle
7. Raise Hand Functionality
8. Invite Button
9. Leave Meeting Button
10. Intimation of People leaving and Entering the Room
(The screen share feature is under development)

# Live Demo 
The working demo of CathUp can be tried at https://fathomless-wave-21178.herokuapp.com/  
After Login, share the room link with other participants for them to join.

<b>Demo Video Link:</b> https://youtu.be/Z7HAj0neuj4

![Login Page](https://github.com/Kashishjan/Video_Call_Final/blob/master/Screenshot%20(135).png)

# Instructions After Cloning the Respository
To run the app on local after clone the repository, follow these steps:
1. ```npm install express```
2. Open the public folder >> script.js file. Then paste the following code in exchange of lines 8-13:
   ```
    var peer = new Peer();
    /*var peer =new Peer(undefined, {
    path:'/peerjs',
    host: '/',
    port: '443'
    });*/
    ```
3. Run the command ```Nodemon server.js``` on the terminal

# Agile 101 Methadology Used
Agile is the ability to create and respond to change. It is a way of dealing with, and ultimately succeeding in, an uncertain and turbulent environment. I undertook the following steps to follow agile methadology in the project:
1. Prepared an Excel Sheet to divide the project timeline into smaller sprints (subtasks) so as to get a tangible output at the end of each sprint.
2. Constant interaction with Microsoft mentor and making changes after their feedback (role of customer here).
3. On the code level, writing code in functions so that changing and debugging them becomes easier.
4. Managing Backlog: Bug Fixing and Deliverables
5. Being felxible to learn new things.

