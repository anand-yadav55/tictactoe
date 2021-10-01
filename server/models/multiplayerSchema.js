const mongoose = require('mongoose');

const multiplayerSchema = new mongoose.Schema({
  roomCode: Number,
  playerAName: String,
  playerBName: String,
  playerASocketId: String,
  playerBSocketId: String,
  noOfActivePlayers: Number,
});

const multiplayerModel = mongoose.model('multiplayerModel', multiplayerSchema);
module.exports = { multiplayerModel };
