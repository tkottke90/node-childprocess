"use strict"

const redis = require('redis');
const EventEmitter = require('events')

let client = redis.createClient();
let connection = new EventEmitter();


client.on('error', () => {
    console.log('Redis Client Error');
});

client.on('end', () => {
    console.log(`${Date.now()} - Client Disconnected`);
});

module.exports.client = client;