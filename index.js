
const express = require('express');
const mqtt = require('mqtt');
const url = require('url');
// Parse
const mqtt_url = url.parse(process.env.CLOUDMQTT_URL || 'mqtt://localhost:1883');
const auth = (mqtt_url.auth || ':').split(':');

var client  = mqtt.connect(mqtt_url, [{username: auth[0], password: auth[1]}])
const app = express()
const port = process.env.PORT || 5000

app.get('/', (req, res) => { 
    client.publish('hello/world', 'my message', function() {
        console.log("Message is published");
    });
    res.send('Hello World!');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

