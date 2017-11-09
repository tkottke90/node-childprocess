"use strict"

const second = 1000;
const minute = 60 * 1000;


process.send({ processID : process.pid , status : "build" })
setTimeout(() => {
    process.send({ status : "done" , message : "Constructed a mouth watering burger" });
}, (second * 5));
