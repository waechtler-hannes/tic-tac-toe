function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i][j] = "";
        }
    }

    function placeMarker(cell, activePlayer) {
        board[cell.row][cell.column] = activePlayer.marker;
    }

    return {placeMarker};
}

function GameController(playerOneName = "Player 1", playerTwoName = "Player 2") {
    const players = [
        {name: playerOneName, marker: "X"},
        {name: playerTwoName, marker: "O"}
    ]

    const board = Gameboard();

    let activePlayer = players[0];

    function getPlayerInput() {
        return {
            row: prompt("Select row:"), 
            column: prompt("Select column:")
        };
    }
    
    function playRound() {
        const cell = getPlayerInput();
        board.placeMarker(cell, activePlayer);
    }

    playRound();
}

const game = GameController("Hannes", "Darlyne");