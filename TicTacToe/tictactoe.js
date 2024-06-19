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

    const nextTurn = () => {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    };

    const makeMove = (row, column) => {
        if (winner != null) {
            console.error('Cannot make move, game is complete.');
            return;
        }

        const player = getActivePlayer();
        const success = board.crossOut(row, column, player.playerToken);

        if (success) {
            console.log(`${player.playerName} crosses out cell ${row}, ${column}`);
            checkVictory();
            nextTurn();
        }
    };

    const checkVictory = () => {
        const currentBoard = board.getBoard();
        const winningStreak = 3;
        const rows = currentBoard.length;
        const columns = currentBoard[0].length;

        const getWinner = (winningToken) => {
            let winner = null;
            players.forEach((player) => {
                if (player.playerToken === winningToken) {
                    winner = player.playerName;
                }
            });
            return winner;
        };

        // Horizontal check
        for (let i = 0; i < rows; i++) {
            let previousToken = null;
            let counter = 1;
            for (let j = 0; j < columns; j++) {
                let tokenAtCell = currentBoard[i][j].getValue();
                counter = tokenAtCell && previousToken === tokenAtCell ? counter + 1 : 1;
                previousToken = tokenAtCell;
                if (counter === winningStreak) {
                    winner = getWinner(tokenAtCell);
                    if (winner) return winner;
                }
            }
        }

        // Vertical check
        for (let j = 0; j < columns; j++) {
            let previousToken = null;
            let counter = 1;
            for (let i = 0; i < rows; i++) {
                let tokenAtCell = currentBoard[i][j].getValue();
                counter = tokenAtCell && previousToken === tokenAtCell ? counter + 1 : 1;
                previousToken = tokenAtCell;
                if (counter === winningStreak) {
                    winner = getWinner(tokenAtCell);
                    if (winner) return winner;
                }
            }
        }

        // Diagonal check (top-left to bottom-right)
        for (let i = 0; i <= rows - winningStreak; i++) {
            for (let j = 0; j <= columns - winningStreak; j++) {
                let previousToken = currentBoard[i][j].getValue();
                let counter = previousToken ? 1 : 0;
                for (let k = 1; k < winningStreak; k++) {
                    if (previousToken && currentBoard[i + k][j + k].getValue() === previousToken) {
                        counter++;
                    } else {
                        break;
                    }
                }
                if (counter === winningStreak) {
                    winner = getWinner(previousToken);
                    if (winner) return winner;
                }
            }
        }

        // Diagonal check (bottom-left to top-right)
        for (let i = winningStreak - 1; i < rows; i++) {
            for (let j = 0; j <= columns - winningStreak; j++) {
                let previousToken = currentBoard[i][j].getValue();
                let counter = previousToken ? 1 : 0;
                for (let k = 1; k < winningStreak; k++) {
                    if (previousToken && currentBoard[i - k][j + k].getValue() === previousToken) {
                        counter++;
                    } else {
                        break;
                    }
                }
                if (counter === winningStreak) {
                    winner = getWinner(previousToken);
                    if (winner) return winner;
                }
            }
        }

        return false;
    };


    const getActivePlayer = () => players[currentPlayerIndex];

    const printNewRound = () => {
        board.logBoard();
        if (winner != null) {
            console.log(`Game finished: ${winner} wins`);
        }
        else {
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

game.printNewRound();
game.makeMove(0, 0);
game.printNewRound();
game.makeMove(1, 0);
game.printNewRound();
game.makeMove(1, 1);
game.printNewRound();
game.makeMove(1, 2);
game.printNewRound();
game.makeMove(2, 2);
game.printNewRound();
