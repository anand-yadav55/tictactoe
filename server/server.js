const express = require('express');
const app = express();

const mongoose = require('mongoose');

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => console.log('server running'));

const socket = require('socket.io');
const io = socket(server);

const cors = require('cors');

require('dotenv').config();

mongoose.connect(process.env.mongoURI, () => console.log('connected db'));

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let playerQueue = [];
let roomCodes = [];
const { multiplayerModel } = require('./models/multiplayerSchema');

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
  playerQueue.push(socket.id);
  console.log(playerQueue);
  // if (playerQueue.length >= 2) {
  //   let p1Socket = playerQueue.shift();
  //   console.log(playerQueue);
  //   let p2Socket = playerQueue.shift();
  //   console.log(p2Socket);

  socket.on('join-room', (roomCode) => {
    if (roomCodes.includes(Number(roomCode))) {
      socket.join(roomCode);
    } else {
      return socket.to(socket.id).emit('no-room-found');
    }

    var room = io.sockets.adapter.rooms.get(String(roomCode));
    console.log(room, 'Line ROOM', ' room length:', room.size);

    if (room.size == 2) {
      console.log('sending ready signal');
      io.sockets.in(roomCode).emit('both-ready', roomCode);
    } else {
      console.log('length not 2');
    }
  });
  socket.on('start-room', () => {
    const roomCode = require('./generateRoomCode').createRoomCode();
    roomCodes.push(roomCode);
    socket.join(roomCode);
  });

  // socket.on('create', () => socket.join(roomCode));
  // socket.to(p1Socket).emit('event', 'you matched to play:');
  // socket.emit('event', 'you matched to play:');
  // io.to(p2Socket).emit('both-ready');
  // socket.emit('both-ready');

  // const data = new multiplayerModel({
  //   // roomCode: roomCode,
  //   playerAName: 'Anand',
  //   playerBName: 'Aman',
  //   playerASocketId: p1Socket,
  //   playerBSocketId: p2Socket,
  //   noOfActivePlayers: 2,
  // });
  // console.log(roomCode, 'is the room code');
  // data.save((err, data) => {
  //   if (err) console.log(err);
  //   console.log(data);
  // });
  // }
  socket.on('disconnect', () => {
    console.log('disconnected', socket.id);
  });
  socket.on('msg', (data) => {});
});

app.get('/api/', (req, res) => {
  res.send('api working');
});

// This api is of no work at this point of commit
app.post('/api/createRoom', (req, res) => {
  const roomCode = require('./generateRoomCode').createRoomCode();

  console.log(roomCode);

  roomCodes.push(roomCode);

  res.json({ roomCode: roomCode });
  res.send();
  // console.log(req.body);

  // const data = new multiplayerModel({
  //   roomCode: roomCode,
  //   player1: 'Anand',
  //   player2: 'Aman',
  //   activePlayers: 2,
  // });
  // console.log(roomCode, 'is the room code');
  // data.save((err, data) => {
  //   if (err) console.log(err);
  //   console.log(data);
  // });
  // res.end();
});
/////////////////

app.post('/api/joinRoom', (req, res) => {
  console.log(roomCodes, req.body.roomCode, 'LINE:109');

  if (roomCodes.includes(Number(req.body.roomCode))) {
    console.log(req.body.roomCode, 'is available');
    res.json({ roomCode: req.body.roomCode });
  } else res.json({ msg: 'room not found' });
  res.send();
});
