const express = require('express');
const app = express();

const mongoose = require('mongoose');

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => console.log('server running'));

const socket = require('socket.io');
const io = socket(server);

const cors = require('cors');

require('dotenv').config();

const mongoURI = process.env.mongoURI;

console.log(mongoURI);
mongoose.connect(mongoURI, () => console.log('connected to db'));

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('client/build'));

let playerQueue = [];
let roomCodes = [];
const { multiplayerModel } = require('./models/multiplayerSchema');

io.on('connection', (socket) => {
  // console.log('a user connected', socket.id);
  playerQueue.push(socket.id);
  console.log(playerQueue);

  //on new move on board
  socket.on('new-move', (data) => {
    const [socketID, roomCode, move] = [
      data.socketID,
      data.roomCode,
      data.move,
    ];

    let moveIndex = Number(data.move);

    multiplayerModel.findOne({ roomCode: roomCode }).then((doc) => {
      // console.log(doc.boardState, 'boardS');
      if (doc.boardState[moveIndex] != 'N') {
        socket.emit('event', 'This block is occupied');
        return;
      }

      let newBoardState = [];

      if (doc.whoseMove != socketID) {
        socket.emit('event', 'not your Move');
        return;
      }

      for (let i = 0; i < doc.boardState.length; i++) {
        if (i == moveIndex) {
          if (doc.boardState[i] === 'N') {
            newBoardState.push(socket.id);
          }
        } else {
          newBoardState.push(doc.boardState[i]);
        }
      }

      var room = io.sockets.adapter.rooms.get(String(roomCode));
      const iterator1 = room.values();

      const playerASocketID = iterator1.next().value;
      const playerBSocketID = iterator1.next().value;

      let isX = true;
      isX = socketID == playerASocketID ? true : false;

      io.sockets
        .in(roomCode)
        .emit('boardUpdate', { newBoardState, moveIndex, isX });
      const isWin = require('./checkWinner').isWin(newBoardState);

      const alterChance =
        doc.whoseMove === playerASocketID ? playerBSocketID : playerASocketID;

      multiplayerModel
        .findOneAndUpdate(
          { roomCode: roomCode },
          { boardState: newBoardState, whoseMove: alterChance }
        )
        .then((doc) => {
          // console.log(doc);
        })
        .catch((err) => {
          console.log(err);
        });

      // var room = io.sockets.adapter.rooms.get(String(roomCode));
      // const iterator1 = room.values();

      // const playerASocketID = iterator1.next().value;
      // const playerBSocketID = iterator1.next().value;
      if (isWin) {
        console.log(isWin);
        // if (socket.id == isWin) socket.emit('game-end', 'You won');
        if (isWin == 'DRAW') {
          io.sockets.in(roomCode).emit('result', 'DRAW');
        }
        //sending game end events
        else if (playerASocketID == isWin) {
          io.to(isWin).emit('result', 'You Won');
          io.to(playerBSocketID).emit('result', 'You Lost');
        } else {
          io.to(playerASocketID).emit('result', 'You Lost');
          io.to(playerBSocketID).emit('result', 'You Won');
        }
        io.sockets.in(roomCode).emit('game-end', 'game Ended');

        multiplayerModel.findOneAndDelete({
          roomCode: roomCode,
          playerASocketID: playerASocketID,
          playerBSocketID: playerBSocketID,
        });
      }
    });
  });

  //when new player joins room
  socket.on('join-room', (roomCode) => {
    if (roomCodes.includes(Number(roomCode))) {
      socket.join(roomCode);
    } else {
      return socket.to(socket.id).emit('event', 'no-room-found');
    }

    var room = io.sockets.adapter.rooms.get(String(roomCode));
    // console.log(room, 'Line ROOM', ' room length:', room.size);

    if (room.size == 2) {
      // console.log('sending ready signal');
      let boardState = [];

      for (let i = 0; i < 9; i++) boardState.push('N');

      const iterator1 = room.values();

      const playerASocketID = iterator1.next().value;
      const playerBSocketID = iterator1.next().value;

      multiplayerModel.findOneAndUpdate(
        { roomCode: roomCode },
        {
          playerBSocketId: socket.id,
          noOfActivePlayers: 2,
          playerASocketId: playerASocketID,
          playerBSocketId: playerBSocketID,
          boardState: boardState,
          whoseMove: playerASocketID,
        },
        { new: true },
        (err, doc) => {
          if (err) {
            console.log(err);
          } else {
            // console.log(doc, 'found and updated');
          }
        }
      );

      io.sockets.in(roomCode).emit('both-ready', roomCode);

      io.sockets.to(playerASocketID).emit('move-symbol', true);
      io.sockets.to(playerBSocketID).emit('move-symbol', false);
    } else {
      // console.log('length not 2');
      multiplayerModel
        .findOneAndUpdate(
          { roomCode: roomCode },
          {
            roomCode: roomCode,
            playerASocketId: socket.id,
            noOfActivePlayers: 1,
          },
          { new: true }
        )
        .then((data) => {
          // console.log(data, 'saved');
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });

  //when socket disconnects
  socket.on('disconnect', () => {
    // console.log('disconnected', socket.id);

    const index = playerQueue.indexOf(socket.id);
    if (index > -1) {
      playerQueue.splice(index, 1);
    }

    console.log(playerQueue);
  });
});

app.get('/api/', (req, res) => {
  res.send('api working');
});

app.post('/api/createRoom', (req, res) => {
  const roomCode = require('./generateRoomCode').createRoomCode();

  // console.log(roomCode);

  roomCodes.push(roomCode);

  multiplayerModel({ roomCode: roomCode })
    .save()
    .then(() => {
      // console.log('room added to db')
    })
    .catch((err) => {
      console.log(err);
    });

  res.json({ roomCode: roomCode });
  res.send();
  // console.log(req.body);
});

app.post('/api/joinRoom', (req, res) => {
  // console.log(roomCodes, req.body.roomCode, 'LINE:109');

  if (roomCodes.includes(Number(req.body.roomCode))) {
    // console.log(req.body.roomCode, 'is available');
    res.json({ roomCode: req.body.roomCode });
  } else {
    res.json({ msg: 'room not found' });
  }

  res.send();
});
if (process.env.NODE_ENV == 'production') {
  const path = require('path');
  app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}
