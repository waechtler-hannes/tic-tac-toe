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

    function getBoard() {
        return board;
    }

    function placeMarker(cell, activePlayer) {
        board[cell.row][cell.column] = activePlayer.marker;
    }

    function getCellValue(cell) {
        return board[cell.row][cell.column];
    }

    function getWinPatterns() {
        return [[board[0][0], board[0][1], board[0][2]], 
                [board[1][0], board[1][1], board[1][2]],
                [board[2][0], board[2][1], board[2][2]],
                [board[0][0], board[1][0], board[2][0]],
                [board[0][1], board[1][1], board[2][1]],
                [board[0][2], board[1][2], board[2][2]],
                [board[0][0], board[1][1], board[2][2]],
                [board[0][2], board[1][1], board[2][0]]];
    }

    return {getBoard, placeMarker, getCellValue, getWinPatterns};
}

function GameController(playerOneName = "Player 1", playerTwoName = "Player 2") {
    const players = [
        {name: playerOneName, marker: "X"},
        {name: playerTwoName, marker: "O"}
    ]

    const board = Gameboard();

    let activePlayer = players[0];

    function switchActivePlayer() {
        activePlayer = (activePlayer === players[0]) ? players[1] : players[0];
    }

    function getPlayerInput() {
        return {
            row: prompt("Select row:"), 
            column: prompt("Select column:")
        };
    }

    function checkWin(activePlayer) {
        for(let i = 0; board.getWinPatterns().length > i; i++) {
            if (board.getWinPatterns()[i].every((cell) => cell === activePlayer.marker)) {
                console.log(`${activePlayer.name} wins.`)
            }
        }
        if (board.getBoard().flat().every((cell) => cell)) {
            console.log("Tie");
        }
    }
    
    function playRound() {
        const cell = getPlayerInput();
        if (board.getCellValue(cell) === "") {
            board.placeMarker(cell, activePlayer);
            checkWin(activePlayer);
            switchActivePlayer();
        }
        console.log(board.getBoard());
        playRound();
    }

    playRound();
}

const game = GameController("Hannes", "Darlyne");