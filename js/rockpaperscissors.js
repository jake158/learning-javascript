
function getComputerChoice() {
    // Return random integer - either 0, 1 or 2
    let choice = Math.floor(Math.random() * 3);
    console.log(choice);

    switch (choice) {
        case 0:
            return "Rock";
        case 1:
            return "Paper";
        case 2:
            return "Scissors";
    }
}

console.log(getComputerChoice());
