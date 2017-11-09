const express = require('express');
const bodyParse = require('body-parser');
const redis = require('redis')
const { fork, spawn } = require('child_process');

let taskMaster = fork("./lib/master/master.js");
let app = express();
let client = redis.createClient();

taskMaster.on('message', (data) => {
    console.log(`${new Date().toDateString()} - [TaskManager] - ${data.message}`);
    if(data.error != null){
        console.error(data.err);
    }
});


app.get('', (req, res) => {
    res.send("Connected to NodeJS Server");
});

app.get('/order/:orderID');

app.post('/order', (req, res) => {
    let body = req.is('json') ? req.body : res.jsonp(400, { error : `Bad Request - JSON Required` }) 


});

app.listen(8080, (err) => {
    if(err){
        taskMaster.send({ cmd : "shutdown" });
        process.exit();
    }

    console.log("NodeJS Server Listening on Port: 8080");
})