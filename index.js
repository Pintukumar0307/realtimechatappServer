const http=require('http');
const express =require('express');
const cors=require('cors');
const socketIo=require('socket.io');

const app=express();
const port=5000|| process.env.PORT;


const users =[{}];

app.use(cors());

app.get("/",(req,res)=>{
    res.send("Hell Its working");
})


const server=http.createServer(app);


const io=socketIo(server);

io.on("connection",(socket)=>{
    console.log("New Connection");

    socket.on("joined",({user})=>{
        users[socket.id]=user;
        console.log(`${user} is joined`);
        socket.emit('welcome',{user:"Admin",message:`Welcome to the chat,${users[socket.id]}`})
        socket.broadcast.emit('userJoined',{user:"Admin",message:`${users[socket.id]} has joined the chat`})
        socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]} has left the chat`})
    })

    

    socket.on("message",({message,id})=>{
           io.emit("sendMessage",{user:users[id],message,id})
    })


    socket.on('disconnet',({user})=>{
        users[socket.id]=user;
        socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]} has left the chat`})
        console.log("user left")
    })
    

    

})

server.listen(port,()=>{
    console.log(`server is working on ${port}` );
})





// const http=require("http");
// const express =require("express");
// const cors = require("cors");
// const socketIO = require("socket.io");

// const app=express();
// const port= 5000 ||process.env.PORT ;


// const users=[{}];

// app.use(cors());
// app.get("/",(req,res)=>{
//     res.send("HELL ITS WORKING");
// })

// const server=http.createServer(app);

// const io=socketIO(server);

// io.on("connection",(socket)=>{
//     console.log("New Connection");

//     socket.on('joined',({user})=>{
//           users[socket.id]=user;
//           console.log(`${user} has joined `);
//           socket.broadcast.emit('userJoined',{user:"Admin",message:` ${users[socket.id]} has joined`});
//           socket.emit('welcome',{user:"Admin",message:`Welcome to the chat,${users[socket.id]} `})
//     })

//     socket.on('message',({message,id})=>{
//         io.emit('sendMessage',{user:users[id],message,id});
//     })

//     socket.on('disconnect',()=>{
//           socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]}  has left`});
//         console.log(`user left`);
//     })
// });


// server.listen(port,()=>{
//     console.log(`Working`);
// })