const { socket } = require('../client/src/service/socket');

function checkHorVert(boardState) {
  const horizontal = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ];
  const vertical = [
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ];

  // Horizontal check
  for (let i = 0; i < 3; i++) {
    let socketValue = boardState[horizontal[i][0]];
    if (socketValue == 'N') continue;
    let flag = true;
    for (let j = 0; j < 3; j++) {
      if (boardState[horizontal[i][j]] != socketValue) {
        flag = false;
      }
    }
    if (flag) {
      // console.log(socketValue, 'horizontal win');
      return socketValue;
    }
  }

  //Vertical check
  for (let i = 0; i < 3; i++) {
    let socketValue = boardState[vertical[i][0]];
    if (socketValue == 'N') continue;

    let flag = true;
    for (let j = 0; j < 3; j++) {
      if (boardState[vertical[i][j]] != socketValue) {
        flag = false;
      }
    }
    // console.log(flag, 'flag of vertical win');
    // if (flag) console.log(socketValue, 'WON');
    if (flag) return socketValue;
  }
  return false;
}
function checkDiagonal(boardState) {
  const diagonal = [
    [0, 4, 8],
    [2, 4, 6],
  ];

  let socketValue = boardState[4];
  if (socketValue == 'N') return false;
  for (let i = 0; i < 2; i++) {
    let flag = true;
    for (let j = 0; j < 3; j++) {
      if (boardState[diagonal[i][j]] != socketValue) flag = false;
    }
    if (flag) {
      // console.log(socketValue, 'WON');
      return socketValue;
    }
  }
  return false;
}
function isDraw(boardState) {
  let flag = true;

  for (let i = 0; i < 9; i++) {
    if (boardState[i] == 'N') flag = false;
  }
  return flag;
}

function isWin(boardState) {
  if (isDraw(boardState)) return 'DRAW';
  else if (checkDiagonal(boardState)) return checkDiagonal(boardState);
  else if (checkHorVert(boardState)) return checkHorVert(boardState);
  else return false;
}
module.exports = { isWin };
