'use strict';


function Cell() {
    let value = null;

    const crossOut = (playerToken) => {
        value = playerToken;
    };

    const isFilled = () => value != null;

    const getValue = () => value;

    return {
        crossOut,
        isFilled,
        getValue
    };
}


function Gameboard(rows, columns) {
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const crossOut = (row, column, playerToken) => {
        if (row >= rows || column >= columns) {
            console.error(`Board does not have cell with position: ${row}, ${column}`);
            return false;
        }
        const cell = board[row][column];
        if (cell.isFilled()) {
            console.error(`Cannot fill already filled cell at position ${row}, ${column}`);
            return false;
        }
        cell.crossOut(playerToken);
        return true;
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
    let winner = null;
    const rows = 3;
    const columns = 3;
    const board = Gameboard(rows, columns);

    const getActivePlayer = () => winner != null ? null : players[currentPlayerIndex];

    const nextTurn = () => {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    };

    const makeMove = (row, column) => {
        if (winner) {
            console.error('Cannot make move, game is complete.');
            return;
        }

        const player = getActivePlayer();
        const success = board.crossOut(row, column, player.playerToken);

        if (success) {
            console.log(`${player.playerName} crosses out cell ${row}, ${column}`);
            if (checkVictory(row, column, player.playerToken)) {
                winner = player.playerName;
                console.log(`Game finished: ${winner} wins`);
            } else {
                nextTurn();
            }
        }
    };

    const checkVictory = (row, column, playerToken) => {
        const currentBoard = board.getBoard();
        const winningStreak = 3;

        const checkDirection = (rowIncrement, colIncrement) => {
            let counter = 1;
            let i = row + rowIncrement;
            let j = column + colIncrement;

            while (i >= 0 && i < rows && j >= 0 && j < columns && currentBoard[i][j].getValue() === playerToken) {
                counter++;
                i += rowIncrement;
                j += colIncrement;
            }

            i = row - rowIncrement;
            j = column - colIncrement;

            while (i >= 0 && i < rows && j >= 0 && j < columns && currentBoard[i][j].getValue() === playerToken) {
                counter++;
                i -= rowIncrement;
                j -= colIncrement;
            }

            return counter >= winningStreak;
        };

        return checkDirection(1, 0) ||  // Vertical
            checkDirection(0, 1) ||     // Horizontal
            checkDirection(1, 1) ||     // Diagonal top-left to bottom-right
            checkDirection(1, -1);      // Diagonal bottom-left to top-right
    };

    const printNewRound = () => {
        board.logBoard();
        if (!winner) {
            console.log(`${getActivePlayer().playerName}'s turn`);
        }
    };

    return {
        makeMove,
        getActivePlayer,
        printNewRound
    };
}


const player1 = Player('Alice', 'X');
const player2 = Player('Bob', 'O');
const game = Game([player1, player2]);

game.makeMove(0, 0);
game.makeMove(1, 0);
game.makeMove(1, 1);
game.makeMove(1, 2);
game.makeMove(2, 2);
game.printNewRound();
