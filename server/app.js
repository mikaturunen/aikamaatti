var express = require("express");
var app = express();
var path = require("path");

app.use("/public", express.static(path.join(__dirname, "..", "/client")));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "/client", "index.html"));
})

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);
})
