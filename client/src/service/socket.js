const io = require('socket.io-client');

const SOCKET_URL = process.env.SOCKET_URL || '/';
const socket = io(SOCKET_URL);
module.exports = { socket };
