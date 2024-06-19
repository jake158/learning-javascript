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
        printNewRound();
    };

    const makeMove = (row, column) => {
        if (winner) {
            console.error('Cannot make move, game is complete.');
            return;
        }

        const player = getActivePlayer();
        const success = board.crossOut(+row, +column, player.playerToken);

        if (success) {
            console.log(`${player.playerName} crosses out cell ${row}, ${column}`);

            if (checkVictory(+row, +column, player.playerToken)) {
                winner = player.playerName;
                console.log(`Game finished: ${winner} wins`);
            } else if (isTie()) {
                winner = 'Tie';
                console.log('Game finished with a tie')
            }
            else {
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
            checkDirection(0, 1) ||  // Horizontal
            checkDirection(1, 1) ||  // Diagonal top-left to bottom-right
            checkDirection(1, -1)    // Diagonal bottom-left to top-right
    };

    const isTie = () => {
        const currentBoard = board.getBoard();
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (!currentBoard[i][j].isFilled()) {
                    return false;
                }
            }
        }
        return true;
    }

    const printNewRound = () => {
        board.logBoard();
        if (!winner) {
            console.log(`${getActivePlayer().playerName}'s turn`);
        }
    };

    printNewRound();


    return {
        makeMove,
        getActivePlayer,
        getBoard: board.getBoard
    };
}


function ScreenController() {
    const player1 = Player('Alice', 'X');
    const player2 = Player('Bob', 'O');
    const game = Game([player1, player2]);
    const boardDiv = document.querySelector('.board');

    const cssObj = window.getComputedStyle(boardDiv, null);
    const boardWidth = parseInt(cssObj.getPropertyValue('width'));
    const boardHeight = parseInt(cssObj.getPropertyValue('height'));


    const updateScreen = () => {
        boardDiv.innerHTML = '';
        const board = game.getBoard().map((row) => row.map((cell) => cell.getValue()));

        for (let i = 0; i < board.length; i++) {
            let row = board[i];
            for (let j = 0; j < row.length; j++) {
                const cell = document.createElement('button');
                cell.textContent = board[i][j] != null ? board[i][j] : "";
                cell.dataset.row = i;
                cell.dataset.column = j;

                cell.classList.add('cell');
                cell.style.width = (boardWidth / row.length) + 'px';
                cell.style.height = (boardHeight / board.length) + 'px';

                cell.addEventListener('click', cellClickHandler);
                boardDiv.appendChild(cell);
            }
        }
    }

    const cellClickHandler = (e) => {
        const row = e.target.dataset.row;
        const column = e.target.dataset.column;
        game.makeMove(row, column);
        updateScreen();
    }

    updateScreen();
}


ScreenController();
