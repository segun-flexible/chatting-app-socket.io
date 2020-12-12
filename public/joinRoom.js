function joinRoom(roomName) {

    /* if (nsSocket) {
        nsSocket.close()
    } */
    currentRoom = roomName
    //Update Room Title
    document.querySelector("span.curr-room-text").textContent = roomName
    // Send this roomName to the server!
    
    nsSocket.emit('joinRoom', roomName, (numOfMembers) => {
        document.querySelector(".curr-room-num-users").innerText = numOfMembers;
    })


    //Populate History
    nsSocket.on("populateHistoryFromServer", (arr) => {
        populateMessages(arr)
    });

    
    //Populate Member Count
    nsSocket.on("updateMemberCount", (count) => {
        document.querySelector(".curr-room-num-users").innerHTML = `${count} <span class="glyphicon glyphicon-user"></span>`;
    })

    
    document.querySelector("#search-box").addEventListener("keyup", e => {
        let value = e.target.value.toLocaleLowerCase();
        let regex = new RegExp(value, "gi");

        const list = [...document.querySelectorAll("li .message-text")];
        
        list.forEach(l => {
            if (!regex.test(l.textContent.toLowerCase())) {
                l.parentElement.parentElement.style.display = "none"
            } else {
                l.parentElement.parentElement.style.display = "flex"
            }
        })

        
        
    });


    function populateMessages(arr) {
        let messageUL = document.querySelector("#messages");
        messageUL.innerHTML = ""
        arr.map(i => {
            messageUL.insertAdjacentHTML("beforeend", buildHTML(i))
        });

        messageUL.scrollTo(0,messageUL.scrollHeight)
    }
};



