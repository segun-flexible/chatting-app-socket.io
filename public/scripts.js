let currentRoom,username = prompt("What Is Your Name");


const mainsocket = io("/", {
    query: {
        username
    }
})



//Populating The Namespace
const namespaces = document.querySelector(".namespaces");
mainsocket.on("nsList", data => {
    namespaces.innerHTML = "";

    data.map(ns => {
        namespaces.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src="${ns.img}"></div>`
    });


    //Adding Click Event On It
    Array.from(namespaces.querySelectorAll(".namespace")).forEach(ns => {
        ns.addEventListener("click", e => {
            joinNs(ns.getAttribute("ns"))
        })
    });

    joinNs("/wiki");

    
   
    
})



