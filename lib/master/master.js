"use strict"

const fs = require('fs');
const path = require('path');
const { fork, spawn } = require('child_process');
const { client } = require('../redis/redis');

const CHILDMAX = 4;

let upTimer = 0;
let orderCount = 0;

let workers = [];
let tasks = 0;

const orderTemp = {
    orderID : 0,
    date : 0,
    order : []
}

let curOrder = 0;

function getIdleWorkers(){
    let idle = [];
    for(let w in workers){
        if(workers[w].status == 0){
            idle.push(w);
        }
    }
    return idle;
}

function generateWorker(id){
    let worker = {
        workerID : id,
        processID : 0,
        status: 0,
        statusStr : "",
        jobID : 0,
        currentTask : {},
        body : fork('./lib/children/child')
    }

    worker.body.send({ command : "identify", "workerID" : id })
    worker.body.on('message', (data) => {
        console.log(`[worker${worker.workerID}] - ${JSON.stringify(data)}`);
        if(data.wID != null){
            worker.processID = data.processID;
        } else {
            console.log(`${data.message}`);
        }
    });

    return worker;
}

// Main

workers.push(generateWorker(workers.length));

fs.readFile(path.join(__dirname, 'menu.json'), async (err, data) => {
    if(err){
        process.send({ message : "Missing menu.json", error : `${err}`, code : "fatal"});
    }

    // Loop checks task and worker queue every second
    let mainLoop = setInterval(() => {
        // Check if Redis Client is Connected
        if(client.connected){
            // Check for Idle Workers
            let IW = getIdleWorkers();
            // Check for Tasks
            client.LLEN('task_queue', (err, res) => {
                if(err){
                    process.send({ message : `Redis Error: ${err}`, code : "urgent"});
                } else {
                    if(curOrder.orderID != null){
                        
                        if(res > 0 && IW.length > 0){
                            // Generate OrderID

                            workers[IW[0]].body.send({ command : "order" , "menuItem" : "burger" });
                        }
                    } else {
                        
                    }
                }
            });
        } else {
            process.send({ message : "Redis Client Not Connected" })
        }
    }, 1000);

});
