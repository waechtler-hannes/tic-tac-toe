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
}

function GameController(playerOneName = "Player 1", playerTwoName = "Player 2") {
    const players = [
        {name: playerOneName, marker: "X"},
        {name: playerTwoName, marker: "O"}
    ]

    const board = Gameboard();
}

const game = GameController("Hannes", "Darlyne");