
function generateComputerChoice() {
    // Return random integer - either 0, 1 or 2
    let choice = Math.floor(Math.random() * 3);

    switch (choice) {
        case 0:
            return "rock";
        case 1:
            return "paper";
        case 2:
            return "scissors";
    }
}

function playRound(playerSelection, computerSelection) {

    if (playerSelection.toLowerCase() === computerSelection) {
        return "It's a tie!";
    }

    let output;
    switch (playerSelection.toLowerCase()) {
        case "rock":
            output = (computerSelection === "paper") ? "You lose! Paper beats rock." : "You win! Rock beats scissors."
            break;
        case "paper":
            output = (computerSelection === "scissors") ? "You lose! Scissors beat paper." : "You win! Paper beats rock."
            break;
        case "scissors":
            output = (computerSelection === "rock") ? "You lose! Rock beats scissors." : "You win! Scissors beat paper."
            break;
        default:
            output = "Incorrect player selection";
    }
    return output;
}

function game(getComputerChoice, getPlayerChoice, rounds) {
    let computerChoice, playerChoice, computerScore = 0, playerScore = 0;

    for (let i = 0; i < rounds; i++) {
        console.log(`Round ${i + 1}.`);

        computerChoice = getComputerChoice();
        playerChoice = getPlayerChoice();
        console.log(`Computer choice: ${computerChoice}, Player choice: ${playerChoice}`);

        let roundResult = playRound(playerChoice, computerChoice);
        console.log(roundResult);

        if (roundResult.startsWith("You win!")) { playerScore++; }
        else if (roundResult.startsWith("You lose!")) { computerScore++; }
        else if (roundResult.startsWith("It's a tie!")) { computerScore++; playerScore++; }
    }

    let result;
    console.log("Game results:")

    if (playerScore > computerScore) { result = `You win! Computer score: ${computerScore}, Player score: ${playerScore}.`; }
    else if (playerScore === computerScore) { result = `It's a tie! Computer score: ${computerScore}, Player score: ${playerScore}`; }
    else { result = `You lost! Computer score: ${computerScore}, Player score: ${playerScore}.`; }
    console.log(result);

    return result;
}


game(generateComputerChoice, () => "rock", 5);
