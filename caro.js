const X = 1, O = 2, Empty = 0;
const amountRows = 16, amountCols = 16;
let Turn = X;
let GameIsPlaying = true;
let amountSquare = 0;
let bestMoveForBot = {row: 0, col: 0};
let valueSquare = [];
for (let i = 0; i < amountRows; i++) {
    valueSquare[i] = [];
    for (let j = 0; j < amountCols; j++) {
        valueSquare[i][j] = 0;
    }
}
let prepBotX = 0;
let prepBotY = 0;

function isWin() {
    if (amountSquare === amountCols * amountRows) {
        return 3;
    }
    let i, j;
    let value = '';
    for (let i = 0; i < amountRows; i++) {
        value += '0' + valueSquare[i].join('') + '03';
    }
    for (let j = 0; j < amountCols; j++) {
        value += '0';
        for (let i = 0; i < amountRows; i++) {
            value += valueSquare[i][j];
        }
        value += '03';
    }

    for (let k = 0; k < amountCols; k++) {
        value += '0';
        i = 0;
        j = k;
        while (i < amountRows && j < amountCols) {
            value += valueSquare[i][j];
            i++;
            j++;
        }
        value += '03';
    }
    for (let k = 0; k < amountCols; k++) {
        value += '0';
        i = 0;
        j = k;
        while (i < amountRows && j >= 0) {
            value += valueSquare[i][j];
            i++;
            j--;
        }
        value += '03';
    }
    for (let k = 0; k < amountCols; k++) {
        value += '0';
        i = amountRows - 1;
        j = k;
        while (i >= 0 && j >= 0) {
            value += valueSquare[i][j];
            i--;
            j--;
        }
        value += '03';
    }
    for (let k = 0; k < amountCols; k++) {
        value += '0';
        i = amountRows - 1;
        j = k;
        while (i >= 0 && j < amountCols) {
            value += valueSquare[i][j];
            i--;
            j++;
        }
        value += '03';
    }

    if (value.search(/[^1]111110/) !== -1 || value.search(/011111[^1]/) !== -1) {
        return 1
    }
    if (value.search(/[^2]222220/) !== -1 || value.search(/022222[^2]/) !== -1) {
        return 2
    }

}


function cval() {
    let cval_value = 0;
    let i, j;
    let val = function (XO) {
        let mArray = [];
        let value = 0;
        let count = 0;
        let regexp = (XO === X) ? /[^1][01][01][01][01][01]0/g : /[^2][02][02][02][02][02]0/g;
        let regexp2 = (XO === X) ? /0[01][01][01][01][01][^1]/g : /0[02][02][02][02][02][^2]/g;
        let regexp3 = (XO === X) ? /1/g : /2/g;
        mArray = valStr.match(regexp).concat(valStr.match(regexp2));
        for (x in mArray) {
            count = (mArray[x].match(regexp3) || []).length;
            switch (count) {
                case 5:
                    value += 100000000;
                    break;
                case 4:
                    value += 1000;
                    break;
                case 3:
                    value += 10;
                    break;
                case 2:
                    value += 1;
                    break;
            }
        }
        return value;
    };
    let valStr = '';
    for (let i = 0; i < amountRows; i++) {
        valStr += '0' + valueSquare[i].join('') + '03';
    }

    for (let j = 0; j < amountCols; j++) {
        valStr += '0';
        for (let i = 0; i < amountRows; i++) {
            valStr += valueSquare[i][j];
        }
        valStr += '03';
    }
    for (let k = 0; k < amountCols; k++) {
        valStr += '0';
        i = 0;
        j = k;
        while (i < amountRows && j < amountCols) {
            valStr += valueSquare[i][j];
            i++;
            j++;
        }
        valStr += '03';
    }
    for (let k = 0; k < amountCols; k++) {
        valStr += '0';
        i = 0;
        j = k;
        while (i < amountRows && j >= 0) {
            valStr += valueSquare[i][j];
            i++;
            j--;
        }
        valStr += '03';
    }
    for (let k = 0; k < amountCols; k++) {
        valStr += '0';
        i = amountRows - 1;
        j = k;
        while (i >= 0 && j >= 0) {
            valStr += valueSquare[i][j];
            i--;
            j--;
        }
        valStr += '03';
    }
    for (let k = 0; k < amountCols; k++) {
        valStr += '0';
        i = amountRows - 1;
        j = k;
        while (i >= 0 && j < amountCols) {
            valStr += valueSquare[i][j];
            i--;
            j++;
        }
        valStr += '03';
    }
    cval_value = val(O) - val(X);
    return cval_value;
}

function alphabeta(XO, alpha, beta, depth) {
    if (depth === 0) {
        return cval();
    }
    if (isWin() === X) {
        return -999999999;
    }
    if (isWin() === O) {
        return 999999999;
    }
    let moveGen = function (XO) {
        this.moveRow = [];
        this.moveCol = [];
        this.noOfMove = 0;
        let possi = [];
        for (let i = 0; i < amountRows; i++) {
            possi[i] = [];
            for (let j = 0; j < amountCols; j++) {
                possi[i][j] = false;
            }
        }
        for (let i = 0; i < amountRows; i++) {
            for (let j = 0; j < amountCols; j++) {
                if ((valueSquare[i][j] === Empty) && (!possi[i][j])) {
                    for (let stepI = -1; stepI <= 1; stepI++) {
                        for (let stepJ = -1; stepJ <= 1; stepJ++) {
                            if (i + stepI >= 0 && i + stepI < amountRows && j + stepJ >= 0 && j + stepJ < amountCols) {
                                if (valueSquare[i + stepI][j + stepJ] !== Empty) {
                                    possi[i][j] = true;
                                }
                            }
                        }
                    }
                }
            }
        }
        for (let i = 0; i < amountRows; i++) {
            for (let j = 0; j < amountCols; j++) {
                if (possi[i][j]) {
                    this.noOfMove++;
                    this.moveRow[this.noOfMove] = i;
                    this.moveCol[this.noOfMove] = j;

                }
            }
        }
    };
    let makeMove = function (moveBoard, movePointer, XO) {
        valueSquare[moveBoard.moveRow[movePointer]][moveBoard.moveCol[movePointer]] = XO;
    };
    let undoMove = function (moveBoard, movePointer) {
        valueSquare[moveBoard.moveRow[movePointer]][moveBoard.moveCol[movePointer]] = Empty;
    };
    let gen = new moveGen(XO);
    let movePointer = 1;
    let score;
    if (XO === O) {
        while (movePointer <= gen.noOfMove) {
            makeMove(gen, movePointer, XO);
            score = alphabeta(X, alpha, beta, depth - 1);
            undoMove(gen, movePointer);
            if (score > alpha) {
                bestMoveForBot.row = gen.moveRow[movePointer];
                bestMoveForBot.col = gen.moveCol[movePointer];
                alpha = score;
            }
            if (alpha >= beta) {
                return alpha;
            }
            movePointer++;
        }
        return alpha;
    } else {
        while (movePointer <= gen.noOfMove) {
            makeMove(gen, movePointer, XO);
            score = alphabeta(O, alpha, beta, depth - 1);
            undoMove(gen, movePointer);
            if (score < beta) {
                beta = score;
            }
            if (alpha >= beta) return beta;
            movePointer++;
        }
        return beta;
    }
}


function checkWin() {
    let result = isWin();
    if (result === 1) {
        alert('Chúc mừng chủ tịch!!!');
        GameIsPlaying = false;
    } else if (result === 2) {
        alert('Chủ tịch gà quá đê!');
        GameIsPlaying = false;
    } else if (result === 3) {
        alert('Hoà!');
        GameIsPlaying = false;
    }
}

function squareClick(row, col) {
    if (GameIsPlaying && valueSquare[row][col] === 0 && Turn === X) {
        document.getElementById('s' + String('00' + prepBotX).slice(-2) + String('00' + prepBotY).slice(-2) + '').style.background = "rgba(255,255,255,0.5)";
        valueSquare[row][col] = X;
        squareUpdate(row, col);
        amountSquare++;
        Turn = O;
        checkWin();
        alphabeta(O, -Infinity, Infinity, 2);
        valueSquare[bestMoveForBot.row][bestMoveForBot.col] = O;
        squareUpdate(bestMoveForBot.row, bestMoveForBot.col);
        document.getElementById('s' + String('00' + bestMoveForBot.row).slice(-2) + String('00' + bestMoveForBot.col).slice(-2) + '').style.background = "#ff1200";
        Turn = X;
        amountSquare++;
        checkWin();
        prepBotX = bestMoveForBot.row;
        prepBotY = bestMoveForBot.col;
    }
}

function undo() {
    alert('Tin người vậy ??!! ');
}

function resign() {
    GameIsPlaying = false;
    alert('Bỏ cuộc rồi sao =))');
    newGame();
}

function newGame() {
    document.location.reload();
}

function squareUpdate(i, j) {
    let OHtml = '<img src="img/o.png">';
    let XHtml = '<img src="img/x.png">';
    if (valueSquare[i][j] === O) {
        document.getElementById('s' + String('00' + i).slice(-2) + String('00' + j).slice(-2) + '').innerHTML = OHtml;
    } else if (valueSquare[i][j] === X) {
        document.getElementById('s' + String('00' + i).slice(-2) + String('00' + j).slice(-2) + '').innerHTML = XHtml;
    } else {
        document.getElementById('s' + String('00' + i).slice(-2) + String('00' + j).slice(-2) + '').innerHTML = '';
    }
}
