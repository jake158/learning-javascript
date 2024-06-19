"use strict";

const buttons = document.querySelectorAll("button");
const display = document.querySelector(".display");
const score = document.querySelector(".score");

const maxRound = 5;
let round = 1;
let playerScore = 0;
let computerScore = 0;

buttons.forEach((button) => {
    button.addEventListener("click", () => handleGame(button.id));
});

function handleGame(playerChoice) {
    if (round > maxRound) return;

    const computerChoice = generateComputerChoice();
    const roundResult = playRound(playerChoice, computerChoice);

    if (roundResult.startsWith("You win!")) {
        playerScore++;
    } else if (roundResult.startsWith("You lose!")) {
        computerScore++;
    } else if (roundResult.startsWith("It's a tie!")) {
        computerScore++;
        playerScore++;
    }

    let resultText = `Computer choice: ${computerChoice}. Player choice: ${playerChoice}. ${roundResult}`;
    let scoreText = `Player score: ${playerScore}, Computer score: ${computerScore}, Round: ${round} out of ${maxRound}`;

    if (round === maxRound) {
        resultText = gameEnded(playerScore, computerScore);
    }
    round++;

    display.textContent = resultText;
    score.textContent = scoreText;
}

function generateComputerChoice() {
    let choice = Math.floor(Math.random() * 3);
    return ['rock', 'paper', 'scissors'][choice];
}

function playRound(playerSelection, computerSelection) {
    if (playerSelection.toLowerCase() === computerSelection) {
        return "It's a tie!";
    }

    let output;
    switch (playerSelection.toLowerCase()) {
        case "rock":
            output = (computerSelection === "paper") ? "You lose! Paper beats rock." : "You win! Rock beats scissors.";
            break;
        case "paper":
            output = (computerSelection === "scissors") ? "You lose! Scissors beat paper." : "You win! Paper beats rock.";
            break;
        case "scissors":
            output = (computerSelection === "rock") ? "You lose! Rock beats scissors." : "You win! Scissors beat paper.";
            break;
        default:
            output = "Incorrect player selection";
    }
    return output;
}

function gameEnded(playerScore, computerScore) {
    if (playerScore == computerScore) {
        return "Game results: It's a tie";
    }
    else if (playerScore > computerScore) {
        return "Game results: You win!";
    }
    else {
        return "Game results: You lose!";
    }
}
