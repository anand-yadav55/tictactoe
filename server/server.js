const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => console.log('server running'));

const socket = require('socket.io');
const io = socket(server);

const cors = require('cors');

app.use(cors());

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
  socket.on('disconnect', () => {
    console.log('disconnected', socket.id);
  });
});

app.get('/api/', (req, res) => {
  res.send('api working');
});

app.get('/api/createRoom', (req, res) => {});
