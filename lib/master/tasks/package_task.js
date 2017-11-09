"use strict"

const second = 1000;
const minute = 60 * 1000;


process.send({ processID : process.pid , status : "package" })
setTimeout(() => {
    process.send({ status : "done" , message : "Tenderly packaging the item" });
}, (second * 5));
