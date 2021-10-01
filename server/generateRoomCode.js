function createRoomCode() {
  let code = 0;
  for (let i = 0; i < 5; i++) {
    code = code * 10 + Math.floor(Math.random() * 10);
  }
  return code;
}
module.exports = { createRoomCode };
