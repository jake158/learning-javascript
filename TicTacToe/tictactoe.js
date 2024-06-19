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
        valueBoard.forEach(row => console.log(row));
    }

    return { getBoard, crossOut, logBoard }
}


function Player(playerName, playerToken) {
    return { playerName, playerToken };
}


function Game(players, rows = 3, columns = 3) {
    if (!Array.isArray(players) || players.length === 0) {
        console.error('Game requires an array of players with at least one player.');
        return;
    }

    let currentPlayerIndex = 0;
    let winner = null;
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
                console.log('Game finished with a tie');
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
            checkDirection(0, 1) ||  // Horizontal
            checkDirection(1, 1) ||  // Diagonal top-left to bottom-right
            checkDirection(1, -1);   // Diagonal bottom-left to top-right
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

    const getWinner = () => winner;

    return {
        makeMove,
        getActivePlayer,
        getBoard: board.getBoard,
        getWinner
    };
}


function ScreenController() {
    let players = [];
    let game;

    const boardDiv = document.querySelector('.board');
    const playerTurnDiv = document.querySelector('.turn');
    const sidePanel = document.querySelector('.sidepanel');

    const addPlayerButton = sidePanel.querySelector('#add-player');
    const playerNameInput = sidePanel.querySelector('#player-name');
    const playerTokenInput = sidePanel.querySelector('#player-token');
    const setBoardSizeButton = sidePanel.querySelector('#set-board-size');
    const boardRowsInput = sidePanel.querySelector('#board-rows');
    const boardColumnsInput = sidePanel.querySelector('#board-columns');
    const playerList = sidePanel.querySelector('#player-list');

    const addPlayer = () => {
        const playerName = playerNameInput.value.trim();
        const playerToken = playerTokenInput.value.trim();

        if (playerName && playerToken && playerToken.length === 1) {
            players.push(Player(playerName, playerToken));
            playerNameInput.value = '';
            playerTokenInput.value = '';
            console.log(`Added player: ${playerName} with token: ${playerToken}`);
            updatePlayerList();
        } else {
            console.error('Player name and token (1 character) are required.');
        }
    };

    const updatePlayerList = () => {
        playerList.innerHTML = '';
        players.forEach(player => {
            const playerItem = document.createElement('li');
            playerItem.textContent = `${player.playerName} (${player.playerToken})`;
            playerList.appendChild(playerItem);
        });
    };

    const setBoardSize = () => {
        const rows = parseInt(boardRowsInput.value, 10);
        const columns = parseInt(boardColumnsInput.value, 10);

        if (rows >= 3 && columns >= 3) {
            game = Game(players, rows, columns);
            updateScreen();
        } else {
            console.error('Rows and columns must be at least 3.');
        }
    };

    const updateScreen = () => {
        if (!game) return;

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
                cell.style.width = `${100 / row.length}%`;
                cell.style.height = `${100 / board.length}%`;

                cell.addEventListener('click', cellClickHandler);
                boardDiv.appendChild(cell);
            }
        }

        const activePlayer = game.getActivePlayer();
        if (activePlayer) {
            playerTurnDiv.textContent = `${activePlayer.playerName}'s turn...`;
        } else if (game.getWinner() === 'Tie') {
            playerTurnDiv.textContent = 'Game finished with a tie!';
        } else {
            playerTurnDiv.textContent = `Game finished: ${game.getWinner()} wins!`;
        }
    };

    const cellClickHandler = (e) => {
        const row = e.target.dataset.row;
        const column = e.target.dataset.column;
        game.makeMove(row, column);
        updateScreen();
    };

    addPlayerButton.addEventListener('click', addPlayer);
    setBoardSizeButton.addEventListener('click', setBoardSize);

    // Initial setup with default values
    players = [Player('Alice', 'X'), Player('Bob', 'O')];
    updatePlayerList();
    game = Game(players);
    updateScreen();
}


ScreenController();
