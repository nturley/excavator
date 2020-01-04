
const express = require('express')
var mqtt = require('mqtt'), url = require('url');
// Parse
var mqtt_url = url.parse(process.env.CLOUDMQTT_URL || 'mqtt://localhost:1883');
var auth = (mqtt_url.auth || ':').split(':');



const app = express()
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
    // Create a client connection
    var client = mqtt.createClient(mqtt_url.port, mqtt_url.hostname, {
        username: auth[0],
        password: auth[1]
    });
    client.on('connect', function() { // When connected      
        // publish a message to a topic
        client.publish('hello/world', 'my message', function() {
          console.log("Message is published");
          client.end(); // Close the connection when published
        });
      });
  
    res.send('Hello World!');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

