const express = require("express");
const socketio = require("socket.io")
const path = require("path");
const namespaces = require("./data/namespaces");
const app = express();

app.use(express.static(path.join(__dirname,"public")))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,"public","chat.html"))
})

const expressServer = app.listen(3000);

const io = socketio(expressServer);

//Main Namespace
io.on("connection", (socket) => {
    let nsData = namespaces.map(ns => {
        return { img: ns.img, title: ns.nsTitle,endpoint:ns.endpoint }
    });

    socket.emit("nsList",nsData)
})

namespaces.forEach(namespace => {
    io.of(namespace.endpoint).on("connection", (nsSocket) => {
        
        /* nsSocket.id = Date.now() + Math.random() * Date.now() */
console.log(io.engine )
        
        const currentNsp = nsSocket.adapter.nsp.name;

        //Load NS
        nsSocket.emit("nsRoomLoad", namespace.rooms);

        //Join ROom
        nsSocket.on("joinRoom", async (roomName, numOfUsers) => {
            
            const prevRoom = await io.of(namespace.endpoint).adapter.rooms
            let prevRoomCount = Array.from(prevRoom, ([name, value]) => ({ name, value }));
            
            if (prevRoomCount.length > 1) { 
                /* const numofU = await prevRoom.get(roomName).size;
                await io.of(namespace.endpoint).to(roomName).emit("updateMemberCount", numofU);
                 */
                nsSocket.leave(prevRoomCount[1].name);
                
            }  
            await nsSocket.join(roomName);
            
            
            
            const rms = namespace.rooms.find(r => r.roomTitle === roomName);
            
            //History Catchup
            nsSocket.emit("populateHistoryFromServer",rms.history)
            
            
            const num = await io.of(namespace.endpoint).adapter.rooms.get(roomName).size;

            numOfUsers(num);
            io.of(namespace.endpoint).to(roomName).emit("updateMemberCount", num);
            

            
         
        });


        /* nsSocket.on("populateHistory", (room) => {
            const rm = namespaces.find(ns => ns.endpoint === currentNsp).rooms[0];
            console.log(rm)
            io.of("/wiki").to("New Articles").emit("populateHistoryFromServer",rm.history)
        }) */

        //Receieve Message From Clients
        nsSocket.on("messageToServer", (data) => {
            
            const msg = {
                text: data.text,
                username: nsSocket.handshake.query.username,
                time: Date.now(),
                avatar: 'https://images.unsplash.com/photo-1607454317233-28962e07083a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
            };
            
            //Push Message To Room History
            
            const rm = namespace.rooms.find(r => r.roomTitle === data.roomName);
            rm.addMessage(msg)
            


            io.of(namespace.endpoint).to(data.roomName).emit("messageToClient", msg)
        })

    })
})


