'use strict';


function Cell() {
    let value = "";

    const crossOut = (playerToken) => {
        value = playerToken;
    };

    const isEmpty = () => value === "";

    const getValue = () => value;

    return {
        crossOut,
        isEmpty,
        getValue
    };
}


function Gameboard(rows = 3, columns = 3) {
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const crossOut = (row, column, playerToken) => {
        if (row > rows || column > columns) {
            console.error(`Board does not have cell with position: ${row}, ${column}`);
            return;
        }
        const cell = board[row][column];
        if (!cell.isEmpty()) {
            console.error(`Cannot fill already filled cell at position ${row}, ${column}`);
            return;
        }
        cell.crossOut(playerToken);
    }

    const logBoard = () => {
        const valueBoard = board.map((row) => row.map((cell) => cell.getValue()));
        for (let i = 0; i < rows; i++) {
            console.log(valueBoard[i]);
        }
    }

    return { getBoard, crossOut, logBoard }
}


function Player(playerName, playerToken) {
    return { playerName, playerToken }
}


function Game(players) {
    if (!Array.isArray(players) || players.length === 0) {
        console.error('Game requires an array of players with at least one player.');
    }

    let currentPlayerIndex = 0;
    const board = Gameboard();

    const nextTurn = () => {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    };

    const getActivePlayer = () => players[currentPlayerIndex];

    const makeMove = (row, column) => {
        const player = getActivePlayer();
        board.crossOut(row, column, player.playerToken);
        nextTurn();
    };

    const logBoard = () => {
        board.logBoard();
    };

    return {
        getActivePlayer,
        makeMove,
        logBoard,
    };
}


const player1 = Player('Alice', 'X');
const player2 = Player('Bob', 'O');
const game = Game([player1, player2]);

game.makeMove(0, 0);
game.logBoard();
game.makeMove(1, 1);
game.logBoard();
