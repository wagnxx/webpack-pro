const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

const browserify = require('browserify-middleware');
app.use(express.static('dist'))
app.get('/js/simple-peer.js', browserify(['simple-peer']));


const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, '/../cert', 'private.key')),
  cert: fs.readFileSync(path.join(__dirname, '/../cert', 'mydomain.crt'))
};


const server = require('https').createServer(httpsOptions, app);
const socket = require('socket.io');

const io = socket(server, {
  cors: {
    origin: '*',
    methods: '*',
    credentials: true
  }
});


io.on('connection', (socket) => {
  console.log('defualt io namespace connected,id  : ',socket.id)
});

io.of('/one-many').on('connection',require('./one-many')(io))
io.of('/many-many').on('connection',require('./many-many')(io))

server.listen(3000);
