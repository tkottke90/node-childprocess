"use strict"

const second = 1000;
const minute = 60 * 1000;


process.send({ processID : process.pid , status : "grilling" })
setTimeout(() => {
    process.send({ status : "done" , message : "Burger flame grilled to perfenction" });
}, (second * 5));
