
function getComputerChoice() {
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

let computerChoice = getComputerChoice();
console.log(`Computer choice: ${computerChoice}`)

console.log("Playing as Rock:")
console.log(playRound("Rock", computerChoice));

console.log("Playing as Paper:")
console.log(playRound("Paper", computerChoice));

console.log("Playing as Scissors:")
console.log(playRound("Scissors", computerChoice));
