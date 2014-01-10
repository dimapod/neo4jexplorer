var sio     = require('socket.io');
var http    = require('http');
var cmd     = require('./lib/command').cmd;
var g       = require('./lib/common');
var express = require('express');
var path    = require('path');

g.log('Starting Graffeine server');

var app = express();

app.configure(function(){
    app.set('port', g.config.server.port || 7006);
    app.use(express.static(path.join(__dirname, './public')));
});

var ws = http.createServer(app).listen(app.get('port'), function(){
    g.log('Express server listening on port ' + g.config.server.port);
});

var conn = sio.listen(ws, { log: true });

conn.sockets.on('connection', function (socket) {

    var command = new cmd.Server(socket);
    
    g.log('Got connection');

    socket.on('graph-init',    command.graphInitialise);
    socket.on('graph-stats',   command.graphStatistics);
    socket.on('graph-fetch',   command.graphFetch);
    socket.on('node-join',     command.nodesJoin);
    socket.on('node-add',      command.nodeAdd);
    socket.on('node-update',   command.nodeUpdate);
    socket.on('node-find',     command.nodeFind);
    socket.on('node-delete',   command.nodeDelete);
    socket.on('nodes-orphans', command.nodesOrphans);
    socket.on('rel-delete',    command.relDelete);

});
