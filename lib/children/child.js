"use strict"

//const { client } = require('../redis/redis');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path')

const menu = JSON.parse(fs.readFileSync("./lib/master/menu.json", "UTF-8"));
const tasks = JSON.parse(fs.readFileSync('./lib/master/tasks.json', "UTF-8"));

let task = {
    status : 0,
    c_process : {}
};
let steps = [];
let curStep = 0;

function assignTask(){
    steps = menu[m.menuItem].buid_tasks;
    task.c_process = fork(path.join("../master/tasks" , tasks[steps[curStep]].task_js));
    task.status = 1;

    task.c_process.on('message', () => {
        if(data.message) process.send({ message : `Starting Step ${curStep} - ${steps[curStep]}`, status: data.status || "working" });
        if(data.status == "done") {
            curStep++;
            task.c_process.kill();
        } else {
            console.log(`[${data.processID}] - Status: ${data.status}`)
        }
    });

    task.c_process.on('exit', (code, signal) => {
        task.status = 0;
    });
}

process.on('message', function(m) {
    switch(m.command){
        case "identify": 
            process.send({ wID : m.workerID , processID : process.pid })
            break;

        case "order":  // { command : "order" , menuItem : <menuItem>  }
            process.send({ message : `Order Recieved for: ${ m.menuItem }` })
            let workClock = setInterval(() => {
                if(task.status > 0 && curStep != steps.length){
                    assignTask();
                } else if(curStep == steps.length){
                    process.send({ message : `Item Completed: ${m.menuItem}` })
                    taskClock = null;
                    process.exit();
                }
            }, 1000);
            break;
        default:
            process.send({ message : "No Command Found"});
            break;
    }
});