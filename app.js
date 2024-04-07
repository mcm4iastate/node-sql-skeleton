const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);
const sqlite3 = require('sqlite3').verbose();

// INIT SQL DB
let db = new sqlite3.Database("database.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database');
});

//db.run("DELETE FROM reviews WHERE name = 'null'");
//db.run("DROP TABLE reviews");

// CREATE SQL TABLE
db.run("CREATE TABLE IF NOT EXISTS test(name TEXT NOT NULL, message TEXT NOT NULL)", [], function(err) {
    if(err) {
        console.error(err.message);
    }
});

// SIMPLE SQL TO ARRAY FUNCTION
async function getArr(sql) {
    let arr;
    arr = await new Promise(function(resolve, reject) {
        let myRows = [];
        db.all(sql, async function(err, rows) {
            if(rows) {
                rows.forEach(row => myRows.push(row));
            }
            const error = false;
            if (error) {
                reject(new Error("Ooops, something broke!"));
            } else {
                resolve(myRows);
            }
        });
    });
    return arr;
}

/*
// INSERT INTO DB
db.run("INSERT INTO test(name, message) VALUES(?, ?)", ["Tim", "Matt you are stinky"], function(err) {
    console.error(err);
});
*/


io.on("connection", (socket) => {
    console.log("New Connection");

    getArr("SELECT * FROM test ORDER BY name DESC").then((res) => {
        socket.emit("test", res);
    });
});

app.use("/", express.static(path.join(__dirname + "/public")));

server.listen(8080);
console.log("Listening on port 8080");