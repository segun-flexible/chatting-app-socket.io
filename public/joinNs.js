let nsSocket,rooms;
function joinNs(endpoint) {
    if (nsSocket) {
    nsSocket.close()
}
    nsSocket = io(endpoint);
   
    const roomList = document.querySelector("ul.room-list");

    nsSocket.on("nsRoomLoad", data => {
        roomList.innerHTML = "";
        data.map(room => {
            
            roomList.innerHTML += `<li onclick="joinRoom('${room.roomTitle}')" class="room"><span class="glyphicon glyphicon-${room.privateRoom ? "lock" : "globe"}"></span>${room.roomTitle}</li>`
            
        });

        //Joining Room
        rooms = document.querySelectorAll("li.room");
        
   /*  joinRoom(rooms[0].innerText) */
        rooms.forEach(room => {
            room.addEventListener("click", (e) => {
                
                joinRoom(e.target.innerText);
            })
        })

        joinRoom(rooms[0].innerText);
        
        
    })   

    
//Receieve Message
    nsSocket.on("messageToClient", (data) => {
        document.querySelector("#messages").insertAdjacentHTML("beforeend", buildHTML(data))
    });



    
    

    
}





//Send Message
document.querySelector(".message-form form").addEventListener("submit", e => {
    e.preventDefault();
    
    const input = e.target.querySelector("input");
    nsSocket.emit("messageToServer", { text: input.value,roomName: currentRoom});
    input.value = ""
})



function buildHTML(data) {
    const newTime = new Date(data.time).toLocaleString().split(",")[1]
    const html = `<li>
                    <div class="user-image">
                        <img src="${data.avatar}">
                    </div>
                    <div class="user-message">
                        <div class="user-name-time">${data.username} <span>${newTime}</span></div>
                        <div class="message-text">${data.text}</div>
                    </div>
                </li>`;
    
    return html
}