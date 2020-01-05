const express = require('express');
const bodyParser = require("body-parser");
const mongodb = require("mongodb");

const app = express()
app.use(bodyParser.json());
const port = process.env.PORT || 5000

var ObjectID = mongodb.ObjectID;
var CONTACTS_COLLECTION = "contacts";

function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({ "error": message });
}

app.get('/', (req, res) => {
    console.log('get!')
    res.send('Hello World!');
});

app.get('/api/contacts', (req, res) => {
    db.collection(CONTACTS_COLLECTION).find({}).toArray(function (err, docs) {
        if (err) {
            handleError(res, err.message, "Failed to get contacts.");
        } else {
            res.status(200).json(docs);
        }
    });
});

// CREATE
app.post("/api/contacts", (req, res) => {
    const newContact = req.body;
    newContact.createDate = new Date();

    if (!newContact.name) {
        handleError(res, "Invalid user input", "Must provide a name.", 400);
    } else {
        db.collection(CONTACTS_COLLECTION).insertOne(newContact, (err, doc) => {
            if (err) {
                handleError(res, err.message, "Failed to create new contact.");
            } else {
                res.status(201).json(doc.ops[0]);
            }
        });
    }
});

// RETRIEVE
app.get("/api/contacts/:id", function (req, res) {
    db.collection(CONTACTS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function (err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to get contact");
        } else {
            res.status(200).json(doc);
        }
    });
});

// UPDATE
app.put("/api/contacts/:id", function (req, res) {
    var updateDoc = req.body;
    delete updateDoc._id;

    db.collection(CONTACTS_COLLECTION).updateOne({ _id: new ObjectID(req.params.id) }, updateDoc, function (err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to update contact");
        } else {
            updateDoc._id = req.params.id;
            res.status(200).json(updateDoc);
        }
    });
});
// DELETE
app.delete("/api/contacts/:id", function (req, res) {
    db.collection(CONTACTS_COLLECTION).deleteOne({ _id: new ObjectID(req.params.id) }, function (err, result) {
        if (err) {
            handleError(res, err.message, "Failed to delete contact");
        } else {
            res.status(200).json(req.params.id);
        }
    });
});



mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test", function (err, client) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    db = client.db();
    console.log("Database connection ready");

    // Initialize the app.
    var server = app.listen(port, function () {
        var port = server.address().port;
        console.log("App now running on port", port);
    });
});