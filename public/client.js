var socket = io();

socket.on("test", (res) => {

    for(var i = 0; i<res.length; i++) {
        var temp = document.createElement("p");
        temp.innerHTML = res[i].name + " ~ " + res[i].message;
        document.body.appendChild(temp);
    }
});